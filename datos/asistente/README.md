# Documentos oficiales del asistente

`documentos.json` es el corpus manual de C9b. Cada documento guarda su organismo, URL, fecha de publicación, fecha de consulta, tema y vencimiento cuando corresponde. Sus `fragmentos` respetan el tipo `Fragmento` de `lib/ia/proveedor.ts`.

Los textos son copias literales y breves. No se resumen ni corrigen: una actualización reemplaza el fragmento solo después de volver a consultar el documento oficial. Los identificadores se mantienen estables para no invalidar citas anteriores.

Las fechas de los dos PDF sin fecha impresa se obtuvieron de sus metadatos: 2 de marzo de 2026 para *Instrumentos de acceso* y 5 de octubre de 2026 para *Beneficios Estudiantiles*. La Oferta Definitiva conserva su fecha oficial de publicación, 24 de septiembre de 2026; sus fragmentos registran la actualización del archivo del 30 de octubre de 2026.

Para comprobar el formato:

```bash
python3 -m unittest tests.datos.test_documentos_asistente
```
