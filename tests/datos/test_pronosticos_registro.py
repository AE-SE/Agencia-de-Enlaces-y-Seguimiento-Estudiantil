"""Pruebas del registro de pronósticos (datos/pronosticos/registro.py)."""

import tempfile
import unittest
import sys
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "datos"))

from pronosticos.registro import (  # noqa: E402
    Pronostico,
    comparar,
    leer,
    registrar,
    verificar_cadena,
)


def _pron(valor=100.0, inferior=90.0, superior=110.0, unidad="06101"):
    return Pronostico(
        fecha_registro="2026-11-07",
        generacion="PAES-2026",
        unidad=unidad,
        variable="rendidores",
        valor_previsto=valor,
        limite_inferior=inferior,
        limite_superior=superior,
        metodo="embudo-v1",
        version_supuestos="supuestos-2026-11-07",
        version_datos="ine-2026-proy",
    )




class Pruebas(unittest.TestCase):
    def setUp(self):
        self._dir = tempfile.TemporaryDirectory()
        self.addCleanup(self._dir.cleanup)
        self.tmp_path = Path(self._dir.name)

    def test_registra_y_la_cadena_queda_valida(self):
        ruta = self.tmp_path / "registro.csv"
        ids = registrar(ruta, [_pron(), _pron(unidad="06102")])
        assert len(ids) == 2
        assert len(leer(ruta)) == 2
        assert verificar_cadena(ruta)



    def test_no_registra_intervalo_invertido(self):
        ruta = self.tmp_path / "registro.csv"
        with self.assertRaises(ValueError):
            registrar(ruta, [_pron(valor=100, inferior=110, superior=90)])
        assert not ruta.exists()



    def test_detecta_fila_alterada(self):
        ruta = self.tmp_path / "registro.csv"
        registrar(ruta, [_pron(), _pron(unidad="06102")])
        texto = ruta.read_text(encoding="utf-8").replace(",100.0,", ",101.0,", 1)
        ruta.write_text(texto, encoding="utf-8")
        assert not verificar_cadena(ruta)



    def test_detecta_fila_borrada(self):
        ruta = self.tmp_path / "registro.csv"
        registrar(ruta, [_pron(), _pron(unidad="06102"), _pron(unidad="06103")])
        lineas = ruta.read_text(encoding="utf-8").splitlines()
        ruta.write_text("\n".join([lineas[0], lineas[2], lineas[3]]) + "\n", encoding="utf-8")
        assert not verificar_cadena(ruta)



    def test_append_no_reescribe_filas_anteriores(self):
        ruta = self.tmp_path / "registro.csv"
        registrar(ruta, [_pron()])
        antes = ruta.read_text(encoding="utf-8")
        registrar(ruta, [_pron(unidad="06102")])
        despues = ruta.read_text(encoding="utf-8")
        assert despues.startswith(antes)
        assert verificar_cadena(ruta)



    def test_comparar_solo_con_observaciones_existentes(self):
        ruta = self.tmp_path / "registro.csv"
        registrar(ruta, [_pron(valor=100, inferior=90, superior=110), _pron(unidad="06102")])
        resultados = comparar(leer(ruta), {("06101", "rendidores"): 105.0})
        assert len(resultados) == 1
        assert resultados[0]["error_absoluto"] == 5.0
        assert resultados[0]["dentro_intervalo"] is True



    def test_comparar_marca_observacion_fuera_de_intervalo(self):
        ruta = self.tmp_path / "registro.csv"
        registrar(ruta, [_pron(valor=100, inferior=90, superior=110)])
        resultados = comparar(leer(ruta), {("06101", "rendidores"): 130.0})
        assert resultados[0]["dentro_intervalo"] is False


if __name__ == "__main__":
    unittest.main()
