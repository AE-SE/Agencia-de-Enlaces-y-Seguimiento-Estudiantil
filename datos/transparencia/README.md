# Datos públicos de la página de transparencia

`pronostico_2027.json` es lo que lee la página `/transparencia` del portal (`app/(portal)/transparencia/`). Contiene **solo agregados nacionales y estadísticas de validación**: nada con nombre de institución, sede, carrera, comuna ni cifras por sexo.

## Cómo se genera

Con los archivos de `datos/procesados/` ya generados en tu equipo, desde la raíz del repositorio:

```bash
python -I datos/pronosticos/exportar_transparencia.py
```

El script elige campo por campo (lista blanca): lo que no está en la lista no sale, aunque exista en los datos de origen. Las cifras nacionales vienen de `datos/pronosticos/dashboard/cifras_nacionales.json`, que a su vez copia el informe del pronóstico.

## Qué se publica y qué no

| Sí | No |
|---|---|
| Dos estimaciones nacionales (primer año 2027 y permanencia 2028) con su rango, fuente y fecha de registro | Cifras por carrera, sede o institución |
| Insumos: cohorte de cuarto medio, razón de entrada, retención por tipo de institución | Cifras por comuna |
| Validación hacia atrás: error nacional, error y cobertura por carrera y sede (solo estadísticas), serie de rendidores, cobertura de los rangos | Proporción de mujeres u otros cruces por variables protegidas |
| Calendario de comparación con lo observado | Rutas internas del repositorio |

Las pruebas que lo exigen están en `tests/datos/test_exportar_transparencia.py` y `tests/transparencia/transparencia.test.ts`.

## Reglas para cambiarlo

- **Las cifras publicadas no se editan.** Si una estimación se corrige, se agrega una versión nueva con su motivo (cambia `version` y la fecha de registro) y la página lo dice.
- Cuando se publiquen los resultados de 2027, el calendario cambia de «por verificar» a «confirmada» y se agrega la comparación con lo observado, sea buena o mala.
- No agregar campos sin justificarlos: cada campo nuevo se revisa contra el ADR 0017 (no nombrar instituciones) y el ADR 0018 (sin variables protegidas).
