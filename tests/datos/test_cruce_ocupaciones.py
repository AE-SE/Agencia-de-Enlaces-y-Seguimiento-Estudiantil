"""Pruebas de la asignación de ocupaciones a áreas (datos/cruce_ocupaciones_areas.py).

Las excepciones por subgrupo SOC se buscan por prefijo; por eso un código
concreto (27-2031.00) debe caer en la excepción más específica (27-203) y no
en la general (27-2).
"""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "datos"))

from cruce_ocupaciones_areas import (  # noqa: E402
    AREA_POR_SUFIJO,
    AREAS,
    EXCEPCIONES,
    EXCEPCIONES_SOC,
    GRUPO_SOC,
    area_de_carrera,
    area_de_ocupacion,
)

ARTE = "Arte y Arquitectura"
SIN_AREA = "Sin área definida"


class PruebasArtistas(unittest.TestCase):
    def test_bailarines_y_coreografos_son_arte(self):
        self.assertEqual(area_de_ocupacion("27-2031.00")[0], ARTE)
        self.assertEqual(area_de_ocupacion("27-2032.00")[0], ARTE)

    def test_musicos_y_directores_musicales_son_arte(self):
        self.assertEqual(area_de_ocupacion("27-2041.00")[0], ARTE)
        self.assertEqual(area_de_ocupacion("27-2042.00")[0], ARTE)

    def test_el_resto_del_subgrupo_27_2_sigue_sin_area(self):
        # Productores, atletas, entrenadores y pinchadiscos no son arte.
        self.assertEqual(area_de_ocupacion("27-2012.00")[0], SIN_AREA)
        self.assertEqual(area_de_ocupacion("27-2021.00")[0], SIN_AREA)
        self.assertEqual(area_de_ocupacion("27-2091.00")[0], SIN_AREA)

    def test_actores_siguen_por_codigo_exacto(self):
        self.assertEqual(area_de_ocupacion("27-2011.00")[0], ARTE)


class PruebasAreaDeCarrera(unittest.TestCase):
    def test_excepcion_por_nombre(self):
        self.assertEqual(area_de_carrera("bibliotecologia"), ("Humanidades", "excepción por nombre"))

    def test_excepcion_por_nombre_normaliza_tildes_mayusculas_y_espacios(self):
        # Los nombres oficiales vienen con tildes y espacios irregulares.
        self.assertEqual(area_de_carrera("  BibliotecologÍa  "), ("Humanidades", "excepción por nombre"))
        self.assertEqual(area_de_carrera("Ingeniería   Comercial"), ("Administración y Comercio", "excepción por nombre"))

    def test_prefijo_pedagogico(self):
        self.assertEqual(area_de_carrera("Pedagogía en Matemáticas"), ("Educación", "prefijo pedagógico"))

    def test_grupo_declarado_en_el_nombre(self):
        self.assertEqual(area_de_carrera("Otros Profesionales de Salud"), ("Salud", "grupo declarado en el nombre"))
        self.assertEqual(
            area_de_carrera("Bachillerato y/o Licenciatura en Ciencias Básicas"),
            ("Ciencias Básicas", "grupo declarado en el nombre"),
        )

    def test_otros_profesionales_de_grupo_desconocido_queda_sin_regla(self):
        # "ingenieria" no está en AREA_POR_SUFIJO y el nombre empieza con "otros", así que ninguna regla posterior aplica.
        self.assertEqual(area_de_carrera("Otros Profesionales de Ingeniería"), (None, None))

    def test_ingenieria_por_defecto(self):
        self.assertEqual(area_de_carrera("Ingeniería Civil Industrial"), ("Tecnología", "ingeniería por defecto"))

    def test_tecnico_en_administracion_contabilidad_o_comercio_exterior(self):
        esperado = ("Administración y Comercio", "técnico en administración o comercio")
        self.assertEqual(area_de_carrera("Técnico en Administración de Empresas"), esperado)
        self.assertEqual(area_de_carrera("Técnico en Contabilidad General"), esperado)
        self.assertEqual(area_de_carrera("Técnico en Comercio Exterior"), esperado)

    def test_tecnico_con_palabra_clave_de_arte(self):
        self.assertEqual(
            area_de_carrera("Técnico en Diseño Gráfico"),
            ("Arte y Arquitectura", "técnico en arte o diseño por palabra clave"),
        )

    def test_palabra_clave_de_arte_solo_calza_palabra_completa(self):
        # "partes" contiene "artes", pero no es una carrera de arte.
        self.assertEqual(area_de_carrera("Técnico en Partes y Piezas"), ("Tecnología", "técnico por defecto"))
        self.assertEqual(
            area_de_carrera("Técnico en Artes Escénicas"),
            ("Arte y Arquitectura", "técnico en arte o diseño por palabra clave"),
        )

    def test_tecnico_por_defecto(self):
        self.assertEqual(area_de_carrera("Técnico en Mecánica Automotriz"), ("Tecnología", "técnico por defecto"))

    def test_diseno_por_nombre(self):
        self.assertEqual(area_de_carrera("Diseño de Vestuario"), ("Arte y Arquitectura", "diseño por nombre"))

    def test_sin_regla_devuelve_none(self):
        self.assertEqual(area_de_carrera("Carrera Inventada"), (None, None))


class PruebasAreaDeOcupacion(unittest.TestCase):
    def test_gerentes_con_excepcion_de_la_revision_2026_11_14(self):
        casos = {
            "11-9031.00": "Educación",
            "11-9111.00": "Salud",
            "11-9151.00": "Ciencias Sociales",
            "11-9161.00": SIN_AREA,
        }
        for codigo, area in casos.items():
            with self.subTest(codigo=codigo):
                self.assertEqual(area_de_ocupacion(codigo), (area, "excepción por código"))

    def test_gerente_sin_excepcion_sigue_el_grupo_soc(self):
        self.assertEqual(area_de_ocupacion("11-1011.00"), ("Administración y Comercio", "grupo SOC"))

    def test_el_prefijo_mas_largo_gana(self):
        # 19-4 es Ciencias Básicas, pero 19-401 (más largo) es Agropecuaria.
        self.assertEqual(area_de_ocupacion("19-4011.00"), ("Agropecuaria", "excepción por subgrupo SOC"))
        self.assertEqual(area_de_ocupacion("19-4021.00"), ("Ciencias Básicas", "excepción por subgrupo SOC"))

    def test_grupo_19_sin_excepcion(self):
        self.assertEqual(area_de_ocupacion("19-2011.00"), ("Ciencias Básicas", "grupo SOC 19-1 y 19-2"))

    def test_grupo_desconocido(self):
        self.assertEqual(area_de_ocupacion("55-1011.00"), (None, None))

    def test_niñeras_son_educacion_como_el_cuidado_de_ninos(self):
        self.assertEqual(area_de_ocupacion("39-9011.00")[0], "Educación")
        self.assertEqual(area_de_ocupacion("39-9011.01")[0], "Educación")


class PruebasConsistenciaDeAreas(unittest.TestCase):
    def test_valores_de_todas_las_tablas_estan_en_areas(self):
        # Un área mal escrita en una tabla crearía una categoría que la pantalla no conoce.
        for tabla in (EXCEPCIONES, AREA_POR_SUFIJO, GRUPO_SOC, EXCEPCIONES_SOC):
            for clave, area in tabla.items():
                with self.subTest(clave=clave):
                    self.assertIn(area, AREAS)

if __name__ == "__main__":
    unittest.main()
