"""Pruebas de datos/cargar_demre.py. Correr con:

    python3 -m unittest discover -s tests/datos -p "test_*.py"

Las páginas son SINTÉTICAS (se arman con la misma geometría que el PDF real: columnas con borde derecho
fijo, código en x≈76, nombre en x≈107, lugar más a la derecha). Una prueba adicional lee el PDF oficial y
se omite si no está (variable DEMRE_PDF; además necesita pypdf).
"""
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "datos"))
import cargar_demre as c  # noqa: E402

# Borde derecho de cada columna en la página sintética, y la posición de su encabezado
BORDES = {"nem": 414, "ranking": 440, "lectora": 468, "m1": 496, "historia": 524, "ciencias": 556, "m2": 580,
          "ponderado": 612, "promedio": 646, "regular": 678, "mc": 702, "bea": 726, "pace": 750}
ENCABEZADOS = {"nem": (355, "NEM"), "ranking": (381, "RANKING"), "lectora": (412, "LECTORA  (C. LECT.)"),
               "m1": (440, "MATEMÁTICA 1 (M1)"), "historia": (469, "CIENCIAS  SOCIALES"), "ciencias": (501, "CIENCIAS"),
               "m2": (531, "MATEMÁTICA 2 (M2)"), "ponderado": (605, "PONDERADO  MÍNIMO"),
               "promedio": (632, "PUNTAJE PROMEDIO"), "regular": (672, "REGULAR"), "mc": (696, "+ MC"),
               "bea": (719, "BEA"), "pace": (742, "PACE")}
COLUMNAS = list(BORDES)
Y0 = 354.5


def x_de(columna, texto):
    ancho = 11.0 if texto == "---" else c.CW * len(texto)
    return round(BORDES[columna] - ancho, 1)


def pagina(filas, columnas=COLUMNAS, ancha=True, n=1):
    """filas: lista de dicts {cod, nombre, lugar, celdas: {columna: texto}, o: bool, y_extra: [(dy, x, texto)]}."""
    t = [[568.4, 698.3, str(n)], [480.2, 187.0, "DESCRIPCIÓN"], [420.0, 339.3, "LUGAR  EN"], [396.0, 339.8, "IMPARTE"]]
    for col in columnas:
        x, s = ENCABEZADOS[col]
        t.append([400.0, float(x), s])
    for i, f in enumerate(filas):
        y = round(Y0 - 21.3 * i, 1)
        t += [[y, 76.0, f["cod"]], [y, 107.6, f["nombre"]], [y, 300.0, f["lugar"]]]
        for col, texto in f["celdas"].items():
            t.append([y, x_de(col, texto), texto])
        if f.get("o"):
            t.append([y, 512.7, "o"])
        for dy, x, texto in f.get("extra", []):
            t.append([round(y + dy, 1), x, texto])
    return {"p": n, "w": 792.0 if ancha else 612.0, "h": 612.0 if ancha else 792.0, "t": t}


def celdas(**kw):
    base = {"nem": "20", "ranking": "15", "lectora": "15", "m1": "25", "historia": "---", "ciencias": "10", "m2": "15",
            "ponderado": "500", "promedio": "485", "regular": "53", "mc": "1", "bea": "2", "pace": "8"}
    base.update(kw)
    return base


def fila(cod="13073", nombre="INGENIERÍA CIVIL INFORMÁTICA", lugar="CONCEPCIÓN", **kw):
    extra = {k: kw.pop(k) for k in ("o", "extra") if k in kw}
    return {"cod": cod, "nombre": nombre, "lugar": lugar, "celdas": celdas(**kw), **extra}


def procesar(*paginas):
    return c.procesar(list(paginas), "2026-11-05")


class LecturaDeFilas(unittest.TestCase):
    def test_fila_completa_con_sus_ponderaciones_requisitos_y_vacantes(self):
        validas, revisar, _ = procesar(pagina([fila()]))
        r = validas[0]
        self.assertEqual(revisar, [])
        self.assertEqual((r["demre_codigo"], r["carrera"], r["lugar"]), ("13073", "INGENIERÍA CIVIL INFORMÁTICA", "CONCEPCIÓN"))
        self.assertEqual((r["nem"], r["ranking"], r["lectora"], r["matematica_1"], r["matematica_2"], r["ciencias"]), (20, 15, 15, 25, 15, 10))
        self.assertIsNone(r["historia_cs_sociales"])  # «---»: no aplica, queda vacío (no es 0)
        self.assertEqual((r["puntaje_ponderado_minimo"], r["puntaje_promedio_minimo"]), (500, 485))
        self.assertEqual((r["vacantes_regular"], r["vacantes_mc"], r["vacantes_bea"], r["vacantes_pace"]), (53, 1, 2, 8))
        self.assertEqual((r["fuente"], r["pagina_pdf"]), ("DEMRE", 1))

    def test_las_53_vacantes_de_concepcion_no_son_las_70_que_da_el_texto_plano(self):
        # Tres carreras seguidas con vacantes distintas: cada fila conserva las suyas
        p = pagina([fila("13071", regular="58"), fila("13072", regular="113"), fila("13073", regular="53")])
        v = {r["demre_codigo"]: r["vacantes_regular"] for r in procesar(p)[0]}
        self.assertEqual(v, {"13071": 58, "13072": 113, "13073": 53})

    def test_historia_o_ciencias_se_cuenta_una_sola_vez(self):
        r = procesar(pagina([fila(nem="10", ranking="40", lectora="10", m1="25", historia="10", ciencias="10", m2="5", o=True)]))[0][0]
        self.assertEqual(r["historia_o_ciencias"], "si")
        self.assertEqual((r["historia_cs_sociales"], r["ciencias"]), (10, 10))

    def test_sin_la_o_dos_pesos_de_10_se_suman_los_dos_y_no_cuadra(self):
        validas, revisar, _ = procesar(pagina([fila(nem="10", ranking="40", lectora="10", m1="25", historia="10", ciencias="10", m2="5")]))
        self.assertEqual(validas, [])
        self.assertIn("suman 110", revisar[0]["motivo"])

    def test_una_electiva_confirmada_por_la_universidad_corrige_la_o_omitida_por_el_pdf(self):
        r = procesar(pagina([fila("17074", nem="20", ranking="40", lectora="15", m1="10", historia="15", ciencias="15", m2="---")]))[0][0]
        self.assertEqual(r["historia_o_ciencias"], "si")
        self.assertEqual(r["fuente_historia_o_ciencias"], "Admisión UACh")
        self.assertIn("uach.cl", r["url_historia_o_ciencias"])

    def test_las_excepciones_estan_en_un_archivo_de_datos_con_trazabilidad(self):
        correcciones = c.cargar_correcciones()
        self.assertEqual(set(correcciones), {"17074", "32012"})
        for correccion in correcciones.values():
            self.assertTrue(correccion["fuente_historia_o_ciencias"])
            self.assertTrue(correccion["url_historia_o_ciencias"].startswith("https://"))
            self.assertRegex(correccion["fecha_consulta_historia_o_ciencias"], r"^\d{4}-\d{2}-\d{2}$")

    def test_celda_vacia_sin_guion_se_asigna_por_posicion_y_no_corre_las_demas(self):
        # Falta la celda «+ MC»: sin posiciones, BEA (2) y PACE (8) se correrían una columna a la izquierda
        celdas_ = celdas()
        del celdas_["mc"]
        f = {"cod": "13073", "nombre": "CARRERA", "lugar": "LUGAR", "celdas": celdas_}
        r = procesar(pagina([f, fila("13074"), fila("13075")]))[0][0]
        self.assertEqual((r["vacantes_regular"], r["vacantes_mc"], r["vacantes_bea"], r["vacantes_pace"]), (53, None, 2, 8))

    def test_un_puntaje_con_decimal_se_lee_y_no_se_pierde_como_celda_vacia(self):
        # Como la fila 13042 del PDF (p. 299): «567,5» antes se descartaba en silencio y dejaba el puntaje vacío
        r = procesar(pagina([fila("13042", nombre="PEDAGOGÍA EN FILOSOFÍA", promedio="567,5", regular="20", bea="2", pace="13")]))[0][0]
        self.assertEqual(r["puntaje_promedio_minimo"], 567.5)
        self.assertEqual((r["vacantes_regular"], r["vacantes_bea"], r["vacantes_pace"]), (20, 2, 13))

    def test_un_decimal_en_una_ponderacion_o_en_las_vacantes_no_se_carga(self):
        for col in ("nem", "regular"):
            validas, revisar, _ = procesar(pagina([fila(**{col: "12,5"})]))
            self.assertEqual(validas, [], col)
            self.assertIn("decimal", revisar[0]["motivo"], col)

    def test_un_texto_con_cifras_que_no_se_reconoce_manda_la_fila_a_revisar_en_vez_de_perderse(self):
        pag = pagina([fila("13042"), fila("13043")])
        pag["t"].append([Y0, 690.0, "5.675"])  # algo que no es una celda conocida, a la altura de la primera fila
        validas, revisar, _ = procesar(pag)
        self.assertEqual([r["demre_codigo"] for r in validas], ["13043"])
        self.assertIn("no se reconoce", revisar[0]["motivo"])

    def test_un_requisito_de_prueba_especial_se_conserva(self):
        pag = pagina([fila()])
        pag["t"] += [[400.0, 580.0, "PRUEBA ESPECIAL"], [Y0, 579.0, "APROBADA"]]
        r = procesar(pag)[0][0]
        self.assertIsNone(r["prueba_especial"])
        self.assertEqual(r["requisito_prueba_especial"], "APROBADA")

    def test_una_ponderacion_de_prueba_especial_sigue_siendo_numerica(self):
        pag = pagina([fila(ciencias="---")])
        pag["t"] += [[400.0, 580.0, "PRUEBA ESPECIAL"], [Y0, 573.8, "10"]]
        r = procesar(pag)[0][0]
        self.assertEqual(r["prueba_especial"], 10)
        self.assertIsNone(r["requisito_prueba_especial"])

    def test_un_requisito_de_asignacion_especial_no_se_mezcla_con_la_ponderacion(self):
        pag = pagina([fila()])
        pag["t"] += [[400.0, 580.0, "ASIGNACIÓN ESPECIAL"], [Y0, 573.9, "SI"]]
        r = procesar(pag)[0][0]
        self.assertIsNone(r["asignacion_especial_pedagogia"])
        self.assertEqual(r["requisito_asignacion_pedagogia"], "SI")

    def test_todo_trozo_con_cifras_de_la_zona_de_datos_es_una_celda(self):
        for texto in ("0", "53", "567,5", "---", "o", "458", "SI", "APROBADA"):
            self.assertTrue(c.TOKEN.match(texto), texto)
        for texto in ("5.675", "1234", "A5", ""):
            self.assertFalse(c.TOKEN.match(texto), texto)

    def test_los_requisitos_vacios_quedan_vacios(self):
        celdas_ = celdas(ponderado="---", promedio="458")
        r = procesar(pagina([{"cod": "11080", "nombre": "ENFERMERÍA", "lugar": "SANTIAGO", "celdas": celdas_}]))[0][0]
        self.assertEqual((r["puntaje_ponderado_minimo"], r["puntaje_promedio_minimo"]), (None, 458))

    def test_un_nombre_de_dos_lineas_y_el_lugar_se_unen(self):
        extra = [(-10.0, 107.6, "GESTIÓN"), (-10.0, 300.0, "SEDE NORTE")]
        r = procesar(pagina([fila(nombre="INGENIERÍA EN INFORMACIÓN Y CONTROL DE", lugar="CONCEPCIÓN", extra=extra)]))[0][0]
        self.assertEqual(r["carrera"], "INGENIERÍA EN INFORMACIÓN Y CONTROL DE GESTIÓN")
        self.assertEqual(r["lugar"], "CONCEPCIÓN SEDE NORTE")

    def test_nombre_y_lugar_a_cuatro_puntos_sobre_y_bajo_las_cifras(self):
        # Como la fila 17074 del PDF: el nombre ocupa una línea arriba y otra abajo de la línea de cifras
        f = {"cod": "17074", "nombre": "", "lugar": "", "celdas": celdas(),
             "extra": [(4.0, 103.1, "PEDAGOGÍA EN EDUCACIÓN FÍSICA"), (4.0, 318.3, "CAMPUS ISLA"), (-4.0, 103.1, "LICENCIATURA EN EDUCACIÓN (2) (10)"), (-4.0, 314.4, "TEJA - VALDIVIA")]}
        r = procesar(pagina([f]))[0][0]
        self.assertEqual(r["carrera"], "PEDAGOGÍA EN EDUCACIÓN FÍSICA LICENCIATURA EN EDUCACIÓN")
        self.assertEqual(r["notas"], "2 10")
        self.assertEqual(r["lugar"], "CAMPUS ISLA TEJA - VALDIVIA")

    def test_las_notas_al_pie_del_nombre_se_separan(self):
        r = procesar(pagina([fila(nombre="GEOGRAFÍA (15)")]))[0][0]
        self.assertEqual((r["carrera"], r["notas"]), ("GEOGRAFÍA", "15"))

    def test_una_nota_con_parentesis_de_cierre_ausente_no_contamina_el_nombre(self):
        r = procesar(pagina([fila(nombre="INGENIERÍA CIVIL (2) (10 (11) (14)")]))[0][0]
        self.assertEqual((r["carrera"], r["notas"]), ("INGENIERÍA CIVIL", "2 10 11 14"))

    def test_vacantes_por_semestre_de_la_universidad_de_chile(self):
        # El encabezado trae «1º SEMESTRE» y «2º SEMESTRE» en lugar de «REGULAR» y «+ MC»
        cols = [c_ for c_ in COLUMNAS if c_ not in ("regular", "mc")]
        t = pagina([], columnas=cols)["t"] + [[400.0, 643.0, "1º"], [400.0, 669.0, "2º"], [400.0, 661.0, "REGULAR"]]
        y = Y0
        t += [[y, 76.0, "11080"], [y, 107.6, "ENFERMERÍA"], [y, 300.0, "SANTIAGO"]]
        for col, texto in celdas(regular="97", mc="---").items():
            if col == "regular":
                t.append([y, round(678 - c.CW * 2, 1), texto])
            elif col == "mc":
                t.append([y, round(702 - 11.0, 1), texto])
            else:
                t.append([y, x_de(col, texto), texto])
        pag = {"p": 1, "w": 792.0, "h": 612.0, "t": [x for x in t if not (x[2] == "+ MC")]}
        r = procesar(pag)[0][0]
        self.assertEqual(r["vacantes_regular"], 97)

    def test_las_paginas_verticales_no_son_tablas(self):
        self.assertEqual(procesar(pagina([fila()], ancha=False))[0], [])

    def test_un_codigo_repetido_no_se_carga_y_se_informa(self):
        validas, revisar, _ = procesar(pagina([fila("13073"), fila("13073", regular="99")]))
        self.assertEqual(validas, [])
        self.assertTrue(all(r["motivo"] == "código repetido en el PDF" for r in revisar))

    def test_requisito_fuera_de_rango_se_revisa(self):
        validas, revisar, _ = procesar(pagina([fila(promedio="50")]))
        self.assertEqual(validas, [])
        self.assertIn("fuera de rango", revisar[0]["motivo"])

    def test_es_repetible_y_no_depende_del_orden(self):
        a = procesar(pagina([fila("13071"), fila("13072"), fila("13073")]))[0]
        b = procesar(pagina([fila("13073"), fila("13071"), fila("13072")]))[0]
        self.assertEqual([r["demre_codigo"] for r in a], ["13071", "13072", "13073"])
        self.assertEqual(sorted(a, key=lambda r: r["demre_codigo"]), sorted(b, key=lambda r: r["demre_codigo"]))


class Asignacion(unittest.TestCase):
    ANCLAS = [100.0, 130.0, 160.0, 190.0]

    def test_todas_las_celdas_presentes(self):
        toks = [(100 - 12.2, "10"), (130 - 12.2, "20"), (160 - 12.2, "30"), (190 - 12.2, "40")]
        self.assertEqual(c.asignar(toks, self.ANCLAS), ["10", "20", "30", "40"])

    def test_una_celda_menos_deja_vacia_la_columna_que_corresponde(self):
        toks = [(100 - 12.2, "10"), (160 - 12.2, "30"), (190 - 12.2, "40")]
        self.assertEqual(c.asignar(toks, self.ANCLAS), ["10", None, "30", "40"])

    def test_mas_celdas_que_columnas_no_se_adivina(self):
        self.assertIsNone(c.asignar([(1, "1")] * 5, self.ANCLAS))


class Cruce(unittest.TestCase):
    def test_une_por_codigo_demre_y_cuenta_lo_que_no_cruza(self):
        validas = [{"demre_codigo": "13073"}, {"demre_codigo": "99999"}]
        oferta = [{"codigo_sies": "I87S1C49J1V3", "codigo_demre": "13073"}, {"codigo_sies": "I1S1C1J1V1", "codigo_demre": ""},
                  {"codigo_sies": "I2S1C1J1V1", "codigo_demre": "55555"}]
        pares, rep = c.cruzar(validas, oferta)
        self.assertEqual(pares, [{"codigo_sies": "I87S1C49J1V3", "demre_codigo": "13073"}])
        self.assertEqual((rep["carreras_de_la_oferta_con_codigo_demre"], rep["codigos_demre_de_la_oferta_que_no_estan_en_el_pdf"]), (2, 1))
        self.assertEqual(rep["filas_del_pdf_que_ninguna_carrera_de_la_oferta_usa"], 1)


@unittest.skipUnless(os.environ.get("DEMRE_PDF"), "defina DEMRE_PDF con la ruta del PDF oficial (necesita pypdf)")
class ContraElPdfOficial(unittest.TestCase):
    """Valores verificados a mano el 2026-11-05 contra el PDF oficial de la Admisión 2027.
    Fuente: https://demre.cl/publicaciones/pdf/2027-26-09-24-oferta-definitiva-carreras-p2027.pdf"""

    @classmethod
    def setUpClass(cls):
        validas, revisar, resumen = c.procesar(c.extraer_paginas(os.environ["DEMRE_PDF"]), "2026-11-05")
        cls.por = {r["demre_codigo"]: r for r in validas}
        cls.revisar, cls.resumen = revisar, resumen

    def test_cobertura(self):
        self.assertGreaterEqual(self.resumen["filas cargadas"], 2150)
        self.assertLessEqual(len(self.revisar), 10)

    def test_ingenieria_civil_informatica_u_de_concepcion_pagina_296(self):
        r = self.por["13073"]
        self.assertEqual((r["vacantes_regular"], r["vacantes_mc"], r["vacantes_bea"], r["vacantes_pace"]), (53, 1, 2, 8))
        self.assertEqual((r["puntaje_ponderado_minimo"], r["puntaje_promedio_minimo"]), (500, 485))

    def test_vacantes_verificadas_en_el_pr_22(self):
        for codigo, vacantes in (("11080", 97), ("19045", 100), ("24040", 75)):
            self.assertEqual(self.por[codigo]["vacantes_regular"], vacantes, codigo)

    def test_todas_las_filas_cargadas_suman_100(self):
        for r in self.por.values():
            pesos = [r[k] or 0 for k in ("nem", "ranking", "lectora", "matematica_1", "matematica_2", "prueba_especial", "asignacion_especial_pedagogia")]
            hc = max(r["historia_cs_sociales"] or 0, r["ciencias"] or 0) if r["historia_o_ciencias"] == "si" else (r["historia_cs_sociales"] or 0) + (r["ciencias"] or 0)
            self.assertEqual(sum(pesos) + hc, 100, r["demre_codigo"])

    def test_los_220_requisitos_de_asignacion_especial_se_conservan_aparte(self):
        requisitos = [r for r in self.por.values() if r["requisito_asignacion_pedagogia"] == "SI"]
        self.assertEqual(len(requisitos), 220)
        self.assertTrue(all(r["asignacion_especial_pedagogia"] is None for r in requisitos))

    def test_los_dos_requisitos_de_prueba_especial_se_conservan_aparte(self):
        requisitos = [r for r in self.por.values() if r["requisito_prueba_especial"] == "APROBADA"]
        self.assertEqual(len(requisitos), 2)
        self.assertTrue(all(r["prueba_especial"] is None for r in requisitos))

    def test_las_dos_electivas_omitidas_por_el_pdf_estan_confirmadas(self):
        self.assertEqual(self.por["17074"]["historia_o_ciencias"], "si")
        self.assertEqual(self.por["32012"]["historia_o_ciencias"], "si")
        self.assertFalse(any(r["demre_codigo"] in {"17074", "32012"} for r in self.revisar))


if __name__ == "__main__":
    unittest.main()
