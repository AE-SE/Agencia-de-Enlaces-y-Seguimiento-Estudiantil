import io
import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).parents[2] / "datos" / "diagnosticos"))
import contar_colisiones_oferta as diagnostico  # noqa: E402


class ContarColisionesOfertaTest(unittest.TestCase):
    def test_cuenta_solo_grupos_con_codigos_distintos(self):
        csv = io.StringIO(
            "institucion_codigo,sede,carrera_codigo,carrera_nombre_oficial,jornada,codigo_sies\n"
            "1,1,10,Derecho,Diurna,I1S1C10J1V1\n"
            "1,1,11,Derecho,Diurna,I1S1C10J1V2\n"
            "1,2,11,Derecho,Diurna,I1S2C11J1V1\n"
            "2,1,10,Derecho,Diurna,I2S1C10J1V1\n"
        )

        self.assertEqual(
            diagnostico.contar(csv),
            {"grupos_con_nombre_repetido": 1, "grupos_con_varios_codigos_sies": 1},
        )

    def test_rechaza_la_base_con_identificadores_de_estudiantes(self):
        csv = io.StringIO(
            "institucion_codigo,sede,carrera_codigo,carrera_nombre_oficial,jornada,codigo_sies,mrun\n"
        )

        with self.assertRaisesRegex(ValueError, "columnas personales: mrun"):
            diagnostico.contar(csv)


if __name__ == "__main__":
    unittest.main()
