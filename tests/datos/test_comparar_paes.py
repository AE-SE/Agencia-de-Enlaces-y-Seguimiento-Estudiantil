"""Pruebas de la comparación de pronósticos PAES con cifras publicadas."""

import tempfile
import unittest
import sys
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "datos" / "pronosticos"))

import comparar_paes_2027 as comp  # noqa: E402
from registro import Pronostico, registrar  # noqa: E402


def _registro(tmp_path: Path) -> Path:
    ruta = tmp_path / "registro.csv"
    registrar(ruta, [
        Pronostico(fecha_registro="2026-11-07", generacion="PAES-REGULAR-2027-DEF2", unidad="02101",
                   variable="rendidores", valor_previsto=1000.0, limite_inferior=800.0,
                   limite_superior=1200.0, metodo="prueba", version_supuestos="prueba",
                   version_datos="prueba"),
        Pronostico(fecha_registro="2026-11-07", generacion="PAES-REGULAR-2027-DEF2", unidad="02201",
                   variable="rendidores", valor_previsto=500.0, limite_inferior=450.0,
                   limite_superior=550.0, metodo="prueba", version_supuestos="prueba",
                   version_datos="prueba"),
    ])
    return ruta


def _observados(tmp_path: Path, filas: list[str]) -> Path:
    ruta = tmp_path / "observados.csv"
    ruta.write_text("unidad,variable,observado\n" + "\n".join(filas) + "\n", encoding="utf-8")
    return ruta




class Pruebas(unittest.TestCase):
    def setUp(self):
        self._dir = tempfile.TemporaryDirectory()
        self.addCleanup(self._dir.cleanup)
        self.tmp_path = Path(self._dir.name)

    def test_cargar_observados_lee_clave_y_cifra(self):
        ruta = _observados(self.tmp_path, ["02101,rendidores,950"])
        assert comp.cargar_observados(ruta) == {("02101", "rendidores"): 950.0}



    def test_comparacion_marca_cobertura_y_error(self):
        from registro import comparar, leer

        registro = _registro(self.tmp_path)
        obs = comp.cargar_observados(_observados(self.tmp_path, ["02101,rendidores,950", "02201,rendidores,600"]))
        filas = comparar(leer(registro), obs)
        por_unidad = {f["unidad"]: f for f in filas}
        assert por_unidad["02101"]["dentro_intervalo"] is True
        assert por_unidad["02201"]["dentro_intervalo"] is False



    def test_sin_observaciones_no_inventa_resultados(self):
        from registro import comparar, leer

        registro = _registro(self.tmp_path)
        assert comparar(leer(registro), {}) == []
        assert comp.resumen([]) == "sin pronósticos con observación"



    def test_main_escribe_detalle(self):
        registro = _registro(self.tmp_path)
        obs = _observados(self.tmp_path, ["02101,rendidores,950"])
        salida = self.tmp_path / "salida" / "detalle.csv"
        assert comp.main(["x", str(registro), str(obs), str(salida)]) == 0
        texto = salida.read_text(encoding="utf-8")
        assert "02101" in texto and "dentro_intervalo" in texto



    def test_main_con_argumentos_incorrectos(self):
        assert comp.main(["x"]) == 2


if __name__ == "__main__":
    unittest.main()
