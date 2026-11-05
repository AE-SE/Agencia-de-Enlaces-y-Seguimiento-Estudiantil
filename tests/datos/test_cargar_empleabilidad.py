"""Pruebas de datos/cargar_empleabilidad.py. Correr con:

    python3 -m unittest discover -s tests/datos -p "test_*.py"

Las filas son INVENTADAS. Una prueba adicional compara contra el archivo oficial del SIES y se omite
si no está (variable SIES_XLSX).
"""
import os
import sys
import tempfile
import unittest
import zipfile
from decimal import Decimal
from xml.sax.saxutils import escape

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "datos"))
import cargar_empleabilidad as c  # noqa: E402

ENC = ["Código", "Tipo de institución", "Nombre de institución", "Acreditación institución (al 31 de octubre 2025)", "Área",
       "Nombre carrera genérica", "Nombre carrera (del título)", "% titulados con continuidad de estudios",
       "Retención 1er\xa0año", "Duración Real (semestres)", "Empleabilidad 1er año", "Empleabilidad 2° año", "Ingreso Promedio al 4° año"]


def fila(**kw):
    b = dict(cod=Decimal(10), tipo="Universidades", inst="UNIVERSIDAD DE PRUEBA", acred="5 años", area="Salud",
             gen="Enfermería", titulo="Enfermería", cont=Decimal("0.1"), ret=Decimal("0.9"), dur=Decimal("11.5"),
             e1=Decimal("0.5979046242774566"), e2=Decimal("0.69"), ing="De $800 mil a $900 mil")
    b.update(kw)
    return [b["cod"], b["tipo"], b["inst"], b["acred"], b["area"], b["gen"], b["titulo"], b["cont"], b["ret"], b["dur"],
            b["e1"], b["e2"], b["ing"]]


def procesar(*filas):
    return c.procesar([ENC, *filas], "2026-11-05")


def hacer_xlsx(ruta, filas, hoja=c.HOJA):
    """Un XLSX mínimo y válido, hecho a mano para probar el lector."""
    textos, indice = [], {}

    def celda(r, i, v):
        ref = chr(65 + i) + str(r)
        if v is None:
            return ""
        if isinstance(v, (int, float, Decimal)):
            return '<c r="%s"><v>%s</v></c>' % (ref, v)
        if v not in indice:
            indice[v] = len(textos)
            textos.append(v)
        return '<c r="%s" t="s"><v>%d</v></c>' % (ref, indice[v])

    cuerpo = "".join('<row r="%d">' % r + "".join(celda(r, i, v) for i, v in enumerate(f)) + "</row>" for r, f in enumerate(filas, 1))
    ns = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
    rel = 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"'
    with zipfile.ZipFile(ruta, "w") as z:
        z.writestr("xl/workbook.xml", '<workbook %s %s><sheets><sheet name="Hoja1" sheetId="1" r:id="rId1"/>'
                   '<sheet name="%s" sheetId="2" r:id="rId2"/></sheets></workbook>' % (ns, rel, hoja))
        z.writestr("xl/_rels/workbook.xml.rels", '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
                   '<Relationship Id="rId1" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Target="worksheets/sheet2.xml"/></Relationships>')
        z.writestr("xl/sharedStrings.xml", "<sst %s>" % ns + "".join("<si><t>%s</t></si>" % escape(t) for t in textos) + "</sst>")
        z.writestr("xl/worksheets/sheet1.xml", '<worksheet %s><sheetData><row r="1"><c r="A1"><v>1</v></c></row></sheetData></worksheet>' % ns)
        z.writestr("xl/worksheets/sheet2.xml", "<worksheet %s><sheetData>%s</sheetData></worksheet>" % (ns, cuerpo))


class Indicadores(unittest.TestCase):
    def test_porcentaje_se_redondea_a_dos_decimales(self):
        self.assertEqual(c.porcentaje(Decimal("0.5979046242774566"))[0], Decimal("59.79"))
        self.assertEqual(c.porcentaje(Decimal("1"))[0], Decimal("100.00"))

    def test_porcentaje_fuera_de_rango_o_texto_queda_vacio_con_motivo_nunca_cero(self):
        for v in (Decimal("1.4"), Decimal("-0.1"), "s/i", "n/a", None, ""):
            valor, motivo = c.porcentaje(v)
            self.assertIsNone(valor, v)
            self.assertTrue(motivo, v)

    def test_el_motivo_cita_lo_que_dice_el_sies_sin_interpretarlo(self):
        self.assertIn("«n/a»", c.porcentaje("n/a")[1])
        self.assertIn("«s/i»", c.semestres("s/i")[1])

    def test_duracion_en_semestres(self):
        self.assertEqual(c.semestres(Decimal("6.476500697999069"))[0], Decimal("6.48"))
        self.assertIsNone(c.semestres(Decimal("0"))[0])
        self.assertIsNone(c.semestres(Decimal("99"))[0])

    def test_montos_de_los_tramos(self):
        casos = {"$1 millón 100 mil": 1100000, "$900 mil": 900000, "$2 millones": 2000000,
                 "$3 millones 500 mil": 3500000, "$800 mil": 800000}
        for texto, esperado in casos.items():
            self.assertEqual(c.monto(texto), esperado, texto)
        self.assertIsNone(c.monto("sin números"))

    def test_tramos_tipicos_del_archivo_real_se_leen(self):
        tramos = ["De $1 millón a $1 millón 100 mil", "De $900 mil a $1 millón", "De $600 mil a $700 mil",
                  "De $2 millones 400 mil a $2 millones 500 mil", "Desde $2 millones 500 mil a $3 millones",
                  "Desde $3 millones a $3 millones 500 mil", "De $1 millón 900 mil a $2 millones"]
        for t in tramos:
            texto, desde, hasta, motivo = c.tramo_de_ingreso(t)
            self.assertEqual(motivo, "", t)
            self.assertTrue(desde < hasta, t)

    def test_sobre_no_tiene_techo_y_no_se_inventa(self):
        _, desde, hasta, motivo = c.tramo_de_ingreso("Sobre $3 millones 500 mil")
        self.assertEqual((desde, hasta, motivo), (3500000, None, ""))

    def test_tramo_ilegible_o_s_i_queda_vacio_con_motivo(self):
        for v in ("s/i", "algo raro", None, ""):
            texto, desde, hasta, motivo = c.tramo_de_ingreso(v)
            self.assertEqual((desde, hasta), (None, None), v)
            self.assertTrue(motivo, v)


class Carga(unittest.TestCase):
    def test_una_fila_por_institucion_y_carrera_generica(self):
        salida, rep = procesar(fila(), fila(cod=Decimal(11)), fila(gen="Psicología"))
        self.assertEqual(len(salida), 3)
        self.assertEqual(rep["filas_leidas"], 3)

    def test_valores_y_periodos(self):
        r = procesar(fila())[0][0]
        self.assertEqual((r["empleabilidad_1er_anio_pct"], r["retencion_1er_anio_pct"], r["duracion_real_semestres"]),
                         (Decimal("59.79"), Decimal("90.00"), Decimal("11.50")))
        self.assertEqual((r["ingreso_4to_anio_desde_pesos"], r["ingreso_4to_anio_hasta_pesos"]), (800000, 900000))
        self.assertIn("2021 a 2023", r["periodo_empleabilidad_1er_anio"])
        self.assertIn("pesos de septiembre de 2025", r["periodo_ingreso"])
        self.assertEqual(r["fuente"], "Mi Futuro")

    def test_derecho_desplaza_los_periodos_y_lo_explica(self):
        r = procesar(fila(gen="Derecho", titulo="Derecho"))[0][0]
        self.assertEqual(r["excepcion_derecho"], "si")
        self.assertIn("2020 a 2022", r["periodo_empleabilidad_1er_anio"])
        self.assertIn("2019 a 2021", r["periodo_empleabilidad_2do_anio"])
        self.assertIn("2017 a 2019", r["periodo_ingreso"])
        self.assertIn("2.º año", r["nota_derecho"])

    def test_el_resto_de_las_carreras_no_tiene_la_excepcion(self):
        r = procesar(fila())[0][0]
        self.assertEqual((r["excepcion_derecho"], r["nota_derecho"]), ("no", ""))

    def test_s_i_y_n_a_quedan_vacios_con_motivo_y_la_fila_se_conserva(self):
        r = procesar(fila(ret="s/i", dur="s/i", e2="n/a", ing="s/i"))[0][0]
        for col, motivo in (("retencion_1er_anio_pct", "motivo_retencion"), ("duracion_real_semestres", "motivo_duracion_real"),
                            ("empleabilidad_2do_anio_pct", "motivo_empleabilidad_2do_anio"), ("ingreso_4to_anio_tramo", "motivo_ingreso")):
            self.assertEqual(r[col], "", col)
            self.assertTrue(r[motivo], motivo)

    def test_la_errata_de_institutos_profesionales_se_acepta(self):
        self.assertEqual(procesar(fila(tipo="Insitutos Profesionales"))[0][0]["institucion_tipo"], "instituto_profesional")

    def test_tipo_desconocido_o_codigo_ilegible_se_descarta_y_se_cuenta(self):
        salida, rep = procesar(fila(tipo="Otro"), fila(cod="abc"))
        self.assertEqual(salida, [])
        self.assertEqual(sum(rep["descartadas"].values()), 2)

    def test_sin_empleabilidad_al_primer_anio_se_descarta(self):
        salida, rep = procesar(fila(e1="s/i"))
        self.assertEqual(salida, [])
        self.assertTrue(rep["descartadas"])

    def test_la_nota_al_pie_no_es_un_error(self):
        nota = [None, "FUENTE: Portal mifuturo.cl, de la Subsecretaría de Educación Superior"]
        salida, rep = c.procesar([ENC, fila(), nota], "2026-11-05")
        self.assertEqual(len(salida), 1)
        self.assertEqual(rep["descartadas"], {})
        self.assertEqual(rep["resumen"]["notas al pie ignoradas"], 1)

    def test_falta_una_columna_da_error_claro(self):
        with self.assertRaises(ValueError):
            c.procesar([ENC[:5], [1, 2, 3, 4, 5]], "2026-11-05")

    def test_los_ordinales_se_aceptan_con_grado_con_o_voladita_o_con_o(self):
        for nuevo in ("º", "o"):
            enc = [x.replace("°", nuevo) for x in ENC]
            self.assertEqual(len(c.procesar([enc, fila()], "2026-11-05")[0]), 1)

    def test_es_repetible_y_no_depende_del_orden_de_entrada(self):
        a = procesar(fila(), fila(cod=Decimal(2)), fila(gen="Derecho"))[0]
        b = procesar(fila(gen="Derecho"), fila(cod=Decimal(2)), fila())[0]
        self.assertEqual(a, b)


class Cruce(unittest.TestCase):
    OFERTA = [
        {"codigo_sies": "I10S1C1J1V1", "institucion_codigo": "10", "carrera_generica": "Enfermería"},
        {"codigo_sies": "I10S2C1J1V1", "institucion_codigo": "10", "carrera_generica": "ENFERMERIA"},  # otra sede, sin tildes
        {"codigo_sies": "I10S1C9J1V1", "institucion_codigo": "10", "carrera_generica": "Kinesiología"},
        {"codigo_sies": "I77S1C1J1V1", "institucion_codigo": "77", "carrera_generica": "Enfermería"},
    ]

    def test_un_dato_del_sies_vale_para_todas_las_sedes_de_esa_institucion_y_carrera(self):
        salida, _ = procesar(fila())
        pares, rep = c.cruzar(salida, self.OFERTA)
        self.assertEqual([p["codigo_sies"] for p in pares], ["I10S1C1J1V1", "I10S2C1J1V1"])
        self.assertEqual((rep["filas_sies_que_cruzan"], rep["filas_sies_sin_cruce"]), (1, 0))

    def test_otra_institucion_con_la_misma_carrera_no_recibe_el_dato(self):
        salida, _ = procesar(fila())
        self.assertNotIn("I77S1C1J1V1", [p["codigo_sies"] for p in c.cruzar(salida, self.OFERTA)[0]])

    def test_lo_que_no_cruza_se_informa(self):
        salida, _ = procesar(fila(), fila(gen="Odontología"))
        _, rep = c.cruzar(salida, self.OFERTA)
        self.assertEqual(rep["filas_sies_sin_cruce"], 1)
        self.assertIn("Odontología", rep["ejemplos_sin_cruce"][0])


class LectorXlsx(unittest.TestCase):
    FILA = [10, "Universidades", "U DE PRUEBA", "5 años", None, "Enfermería", "Enfermería", 0.1, "s/i", 11.5, 0.5979, 0.69, "De $800 mil a $900 mil"]

    def test_lee_la_hoja_correcta_con_textos_numeros_y_celdas_vacias(self):
        with tempfile.TemporaryDirectory() as d:
            ruta = os.path.join(d, "prueba.xlsx")
            hacer_xlsx(ruta, [ENC, self.FILA])
            filas = c.leer_hoja(ruta, c.HOJA)
        self.assertEqual(filas[0][0], "Código")
        self.assertEqual(filas[1][2], "U DE PRUEBA")
        self.assertIsNone(filas[1][4])
        self.assertEqual(filas[1][10], Decimal("0.5979"))

    def test_hoja_inexistente_da_error_claro(self):
        with tempfile.TemporaryDirectory() as d:
            ruta = os.path.join(d, "prueba.xlsx")
            hacer_xlsx(ruta, [ENC])
            with self.assertRaises(ValueError):
                c.leer_hoja(ruta, "Otra hoja")

    def test_de_punta_a_punta_el_encabezado_con_espacio_duro_se_reconoce(self):
        fila_ok = list(self.FILA)
        fila_ok[4], fila_ok[8] = "Salud", 0.9
        with tempfile.TemporaryDirectory() as d:
            ruta = os.path.join(d, "prueba.xlsx")
            hacer_xlsx(ruta, [ENC, fila_ok])
            salida, _ = c.procesar(c.leer_hoja(ruta, c.HOJA), "2026-11-05")
        self.assertEqual(salida[0]["empleabilidad_1er_anio_pct"], Decimal("59.79"))


@unittest.skipUnless(os.environ.get("SIES_XLSX"), "defina SIES_XLSX con la ruta del XLSX oficial del SIES")
class ContraElArchivoOficial(unittest.TestCase):
    """Valores verificados a mano el 2026-11-05 contra el archivo oficial (hoja «Carreras e IES (2025-2026)»).
    Fuente: https://mifuturo.cl/wp-content/uploads/2025/12/Buscador_Empleabilidad_ingresos_2025_2026_SIES.xlsx"""

    @classmethod
    def setUpClass(cls):
        salida, rep = c.procesar(c.leer_hoja(os.environ["SIES_XLSX"], c.HOJA), "2026-11-05")
        cls.salida = salida
        cls.por = {(r["sies_institucion_codigo"], c.clave(r["carrera_generica"])): r for r in salida}
        cls.rep = rep

    def test_1690_filas(self):
        self.assertEqual(self.rep["resumen"]["filas cargadas"], 1690)

    def test_tecnico_en_enfermeria_cft_santo_tomas_fila_97(self):
        r = self.por[("260", c.clave("Técnico en Enfermería"))]
        self.assertEqual((r["empleabilidad_1er_anio_pct"], r["retencion_1er_anio_pct"], r["duracion_real_semestres"]),
                         (Decimal("59.79"), Decimal("79.07"), Decimal("6.48")))
        self.assertEqual((r["ingreso_4to_anio_desde_pesos"], r["ingreso_4to_anio_hasta_pesos"]), (800000, 900000))

    def test_derecho_u_de_antofagasta_fila_668(self):
        r = next(v for v in self.salida if v["excepcion_derecho"] == "si" and v["institucion_nombre"] == "UNIVERSIDAD DE ANTOFAGASTA")
        self.assertEqual((r["empleabilidad_1er_anio_pct"], r["empleabilidad_2do_anio_pct"]), (Decimal("83.33"), Decimal("91.84")))
        self.assertEqual(r["ingreso_4to_anio_tramo"], "")


if __name__ == "__main__":
    unittest.main()
