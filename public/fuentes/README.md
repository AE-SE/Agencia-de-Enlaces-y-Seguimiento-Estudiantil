# Tipografías locales

Procedencia: ZIP de Google Fonts entregado por Alejandro para A2, con las familias
Atkinson Hyperlegible, Atkinson Hyperlegible Next y Atkinson Hyperlegible Mono.
Solo se incorporan las dos últimas, definidas en `docs/diseno.md`.

SHA-256 del ZIP original:
`c85c401b16fedf45acec87a7573d456c2792ba5209d18e156241cc9914223c3c`.

| Archivo | Familia y peso | Tamaño |
| --- | --- | ---: |
| atkinson-next-400.woff2 | Next, normal (400) | 17.704 bytes |
| atkinson-next-700.woff2 | Next, negrita (700) | 18.544 bytes |
| atkinson-mono-400.woff2 | Mono, normal (400) | 14.988 bytes |
| **Total** | | **51.236 bytes** |

Se convirtieron los TTF estáticos a WOFF2 con fontTools 4.68.0 y Brotli 1.2.1.
Se conserva la cobertura completa: el total ya queda bajo 100 KB sin recortar
caracteres. No se cambian nombres de familia, pesos, contornos ni avisos de autoría.

`LICENCIA-OFL.txt` contiene ambos archivos OFL originales completos, incluidos sus
avisos de copyright. La licencia SIL Open Font License 1.1 permite uso comercial,
incrustación y redistribución con el software, conservando la licencia y autorías;
las fuentes no pueden venderse por sí solas. No se declaran nombres reservados
en los avisos de estas dos familias.

Cita del apartado «PERMISSION & CONDITIONS» de los archivos OFL:
«use, study, copy, merge, embed, modify, redistribute, and sell modified and unmodified copies».

La portada carga solamente Next 400 (17.704 bytes); el navegador descarga los otros
pesos o la familia Mono cuando se usan. Solo se precarga Next 400.
Las tres declaraciones usan `font-display: swap` y direcciones del mismo servidor.

## Reproducir y comprobar

```bash
python -m pip install -r scripts/requirements-fuentes.txt
python scripts/fuentes.py ruta/al/archivo.zip
python scripts/fuentes.py --check
```

La comprobación valida formato, familias, pesos, caracteres ASCII y españoles,
ancho uniforme de los dígitos de Mono y presupuesto de 100 KB para los tres archivos.
La página `/prueba-tipografia` permite revisar los caracteres y cifras en el navegador.

Referencias: [Next](https://github.com/googlefonts/atkinson-hyperlegible-next),
[Mono](https://github.com/googlefonts/atkinson-hyperlegible-next-mono) y
[conversión WOFF2 de fontTools](https://fonttools.readthedocs.io/en/stable/ttLib/woff2.html).
