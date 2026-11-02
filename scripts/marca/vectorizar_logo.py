"""Redibuja el logo como SVG a partir del archivo original (PNG/JPG sobre fondo negro).

Uso:  python3 scripts/marca/vectorizar_logo.py diseno/marca/logo-original.jpg public/marca

Por qué existe: el único original del logo es una imagen de mapa de bits. La web
necesita vectores (nítidos en cualquier pantalla, livianos y con versión para modo
oscuro). Dejar el procedimiento en un script lo hace repetible y trazable.

Método: se separa cada color de marca (proyección del píxel sobre el color, porque el
fondo es negro), se sobremuestrea 4 veces para suavizar los bordes, se extraen los
contornos con OpenCV (incluidos los huecos de letras como A, D, O) y se simplifican.
Requiere: pip install -r scripts/requirements.txt
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np

# Los colores salen de diseno/tokens.json para que logo y plataforma nunca se desincronicen (ADR 0006).
_TOKENS = json.loads((Path(__file__).resolve().parents[2] / "diseno" / "tokens.json").read_text(encoding="utf-8"))["color"]
AZUL, CORAL = _TOKENS["claro"]["linea"], _TOKENS["claro"]["accion"]
AZUL_OSCURO = _TOKENS["oscuro"]["linea"]
NOMBRE = "Agencia de Enlace &amp; Seguimiento Estudiantil"
SOBREMUESTREO = 4
CORTE_X = 568        # columna que separa el símbolo del texto en el original
MARGEN = 8           # píxeles libres alrededor del contenido


def bgr(hexa: str) -> np.ndarray:
    h = hexa.lstrip("#")
    return np.array([int(h[4:6], 16), int(h[2:4], 16), int(h[0:2], 16)], np.float32)


def mascara(img: np.ndarray, color: np.ndarray) -> np.ndarray:
    t = (img @ color) / (color @ color)  # cuánto del color hay sobre el negro
    error = np.linalg.norm(img - np.clip(t, 0, 1)[..., None] * color, axis=2)
    m = ((t > 0.5) & (error < 60)).astype(np.uint8) * 255
    return cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))


def trazado(m: np.ndarray, x0: int, x1: int, ox: int, oy: int) -> str:
    s = SOBREMUESTREO
    parte = np.zeros_like(m)
    parte[:, x0 * s:x1 * s] = m[:, x0 * s:x1 * s]
    contornos, _ = cv2.findContours(parte, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    d = []
    for c in contornos:
        if cv2.contourArea(c) < 30 * s * s / 4:  # descarta ruido de compresión
            continue
        pts = cv2.approxPolyDP(c, 1.2, True).reshape(-1, 2) / s
        d.append("M" + " ".join(f"{x - ox:.1f} {y - oy:.1f}" for x, y in pts) + "Z")
    return "".join(d)


def svg(viewbox: str, trazos: list, oscuro_fijo: bool = False) -> str:
    css = f".a{{fill:{AZUL_OSCURO if oscuro_fijo else AZUL}}}.c{{fill:{CORAL}}}"
    if not oscuro_fijo:
        css += f"@media (prefers-color-scheme:dark){{.a{{fill:{AZUL_OSCURO}}}}}"
    cuerpo = "".join(f'<path class="{cl}" fill-rule="evenodd" d="{d}"/>' for cl, d in trazos if d)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" role="img" '
            f'aria-label="{NOMBRE}"><title>{NOMBRE}</title><style>{css}</style>{cuerpo}</svg>\n')


def main(origen: str, destino: str) -> None:
    img = cv2.imread(origen).astype(np.float32)
    grande = cv2.resize(img, None, fx=SOBREMUESTREO, fy=SOBREMUESTREO, interpolation=cv2.INTER_CUBIC)
    ys, xs = np.where(img.max(axis=2) > 60)
    ox, oy = xs.min() - MARGEN, ys.min() - MARGEN
    ancho, alto = xs.max() + MARGEN - ox, ys.max() + MARGEN - oy

    ma, mc = mascara(grande, bgr(AZUL)), mascara(grande, bgr(CORAL))
    simbolo = [("a", trazado(ma, 0, CORTE_X, ox, oy)), ("c", trazado(mc, 0, CORTE_X, ox, oy))]
    texto = [("a", trazado(ma, CORTE_X, img.shape[1], ox, oy)), ("c", trazado(mc, CORTE_X, img.shape[1], ox, oy))]

    out = Path(destino)
    out.mkdir(parents=True, exist_ok=True)
    (out / "logo-horizontal.svg").write_text(svg(f"0 0 {ancho} {alto}", simbolo + texto))
    (out / "logo-horizontal-oscuro.svg").write_text(svg(f"0 0 {ancho} {alto}", simbolo + texto, True))
    lado = CORTE_X - ox
    (out / "simbolo.svg").write_text(svg(f"0 {(alto - lado) / 2:.1f} {lado} {lado}", simbolo))
    print(f"Listo en {out}: logo {ancho}×{alto}, símbolo {lado}×{lado}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
