// El viewBox y los trazos fijan las proporciones del dibujo; cada cabecera controla su tamaño con tokens CSS.
// Metro visto de lado: carro guía con nariz redondeada y un segundo carro que sale del borde,
// para que se lea como convoy de metro y no como locomotora.
export function Tren({ compacto = false }: { compacto?: boolean }) {
  return compacto ? (
    <svg viewBox="0 0 64 32" fill="none" aria-hidden="true">
      <path d="M3 5h40c10 0 17 9 18 19v3H3V5Z" fill="var(--color-marca-linea)" stroke="var(--color-marca-fondo)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 9h7v7H8zm11 0h7v7h-7zm11 0h7v7h-7zm12 0h2c5 0 10 4 12 9H42V9Z" fill="var(--color-marca-fondo)" />
      <path d="M4 21h56" stroke="var(--color-marca-texto)" strokeWidth="2" />
      <circle cx="11" cy="29" r="2.5" fill="var(--color-marca-texto)" /><circle cx="19" cy="29" r="2.5" fill="var(--color-marca-texto)" />
      <circle cx="43" cy="29" r="2.5" fill="var(--color-marca-texto)" /><circle cx="51" cy="29" r="2.5" fill="var(--color-marca-texto)" />
    </svg>
  ) : (
    <svg viewBox="0 0 640 440" fill="none" aria-hidden="true">
      <path d="M-20 92h660" stroke="var(--color-marca-fondo)" strokeWidth="6" />
      <circle cx="150" cy="92" r="15" fill="var(--color-marca-texto)" stroke="var(--color-marca-fondo)" strokeWidth="6" />
      <circle cx="470" cy="92" r="15" fill="var(--color-marca-linea)" stroke="var(--color-marca-fondo)" strokeWidth="6" />
      <path d="M-20 158h336v12H-20zM342 158h200c4 0 8 4 10 12H342z" fill="var(--color-marca-fondo)" />
      <path d="M-20 170h326c6 0 10 4 10 10v130H-20V170Z" fill="var(--color-marca-texto)" stroke="var(--color-marca-fondo)" strokeWidth="7" strokeLinejoin="round" />
      <path d="M342 170h204c40 0 66 42 72 92v48H332V180c0-6 4-10 10-10Z" fill="var(--color-marca-texto)" stroke="var(--color-marca-fondo)" strokeWidth="7" strokeLinejoin="round" />
      <path d="M-20 262h336v14H-20zM332 262h286v14H332z" fill="var(--color-marca-linea)" />
      <path d="M0 192h44v42H0zm56 0h44v42H56zm112 0h44v42h-44zm56 0h44v42h-44zm56 0h24v42h-24zM350 192h44v42h-44zm112 0h44v42h-44z" fill="var(--color-marca-fondo)" />
      <path d="M522 190h28c26 4 44 32 50 62h-78v-62Z" fill="var(--color-marca-fondo)" />
      <path d="M112 182h44v128h-44zM406 182h44v128h-44z" fill="var(--color-marca-texto)" stroke="var(--color-marca-fondo)" strokeWidth="5" />
      <path d="M134 182v128M428 182v128" stroke="var(--color-marca-fondo)" strokeWidth="4" />
      <path d="M118 192h10v40h-10zm22 0h10v40h-10zM412 192h10v40h-10zm22 0h10v40h-10z" fill="var(--color-marca-fondo)" />
      <path d="M316 278h16v12h-16z" fill="var(--color-marca-fondo)" />
      <circle cx="600" cy="292" r="7" fill="var(--color-marca-linea)" stroke="var(--color-marca-fondo)" strokeWidth="4" />
      <path d="M-20 310h336v12H-20zM332 310h286v12H332z" fill="var(--color-marca-fondo)" />
      <path d="M28 326h68M208 326h68M368 326h68M528 326h68" stroke="var(--color-marca-fondo)" strokeWidth="10" strokeLinecap="round" />
      {[40, 84, 220, 264, 380, 424, 540, 584].map(x => <g key={x}><circle cx={x} cy="338" r="16" fill="var(--color-marca-fondo)" /><circle cx={x} cy="338" r="6" fill="var(--color-marca-linea)" /></g>)}
      <path d="M-20 357h680" stroke="var(--color-marca-fondo)" strokeWidth="8" />
      <path d="M10 368v26m60-26v26m60-26v26m60-26v26m60-26v26m60-26v26m60-26v26m60-26v26m60-26v26m60-26v26m60-26v26" stroke="var(--color-marca-fondo)" strokeWidth="5" />
      <path d="M54 30h56m-28-28v56M570 30h48m-24-24v48" stroke="var(--color-marca-fondo)" strokeWidth="4" />
    </svg>
  );
}

// Vagón del convoy de la cabecera: suma uno por cada estación alcanzada.
export function Vagon() {
  return (
    <svg viewBox="0 0 64 32" fill="none" aria-hidden="true">
      <path d="M3 5h58v22H3z" fill="var(--color-marca-linea)" stroke="var(--color-marca-fondo)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 9h8v7H8zm13 0h8v7h-8zm13 0h8v7h-8zm13 0h8v7h-8z" fill="var(--color-marca-fondo)" />
      <path d="M4 21h56" stroke="var(--color-marca-texto)" strokeWidth="2" />
      <circle cx="11" cy="29" r="2.5" fill="var(--color-marca-texto)" /><circle cx="19" cy="29" r="2.5" fill="var(--color-marca-texto)" />
      <circle cx="45" cy="29" r="2.5" fill="var(--color-marca-texto)" /><circle cx="53" cy="29" r="2.5" fill="var(--color-marca-texto)" />
    </svg>
  );
}

export function ComparacionIlustrada() {
  return <svg viewBox="0 0 640 440" fill="none" aria-hidden="true">
    <path d="M-20 370h174c52 0 63-192 128-192h95c65 0 79-110 140-110h150" stroke="var(--color-marca-linea)" strokeWidth="18" />
    <path d="M-20 396h168c85 0 89-70 152-70h144c65 0 78-127 141-127h80" stroke="var(--color-marca-linea)" strokeWidth="10" />
    <path d="m130 89 182-28 38 247-182 28-38-247Z" fill="var(--color-marca-fondo)" />
    <path d="m138 78 182-28 38 247-182 28-38-247Z" fill="var(--color-marca-texto)" stroke="var(--color-marca-fondo)" strokeWidth="6" />
    <path d="m176 116 103-16m-98 49 103-16m-98 50 103-16m-98 50 103-16m-98 50 63-10" stroke="var(--color-marca-fondo)" strokeWidth="10" />
    <path d="m330 114 181 29-39 246-181-29 39-246Z" fill="var(--color-marca-linea)" stroke="var(--color-marca-fondo)" strokeWidth="6" />
    <path d="m357 159 102 16m-107 18 102 16m-107 18 102 16m-107 18 102 16m-107 18 65 10" stroke="var(--color-marca-fondo)" strokeWidth="10" />
    <circle cx="93" cy="370" r="17" fill="var(--color-marca-texto)" stroke="var(--color-marca-fondo)" strokeWidth="6" />
    <circle cx="563" cy="199" r="17" fill="var(--color-marca-linea)" stroke="var(--color-marca-fondo)" strokeWidth="6" />
  </svg>;
}

export function CalendarioIlustrado() {
  return <svg viewBox="0 0 640 440" fill="none" aria-hidden="true">
    <path d="M-20 372h213c83 0 105-292 202-292h265" stroke="var(--color-marca-fondo)" strokeWidth="10" />
    <path d="m190 80 281 35-32 271-281-35 32-271Z" fill="var(--color-marca-fondo)" />
    <path d="m173 69 281 35-32 271-281-35 32-271Z" fill="var(--color-marca-texto)" stroke="var(--color-marca-fondo)" strokeWidth="7" />
    <path d="m173 69 281 35-8 72-281-35 8-72Z" fill="var(--color-marca-linea)" stroke="var(--color-marca-fondo)" strokeWidth="7" />
    <path d="m227 49-8 61m156-42-8 61" stroke="var(--color-marca-fondo)" strokeWidth="14" strokeLinecap="round" />
    <path d="m200 189 35 4m28 4 35 4m28 4 35 4m28 4 18 2m-213 26 35 4m28 4 35 4m28 4 35 4m28 4 18 2m-213 26 35 4m28 4 35 4" stroke="var(--color-marca-fondo)" strokeWidth="14" />
    <circle cx="412" cy="319" r="58" fill="var(--color-marca-fondo)" stroke="var(--color-marca-linea)" strokeWidth="9" />
    <path d="m389 318 17 18 30-37" stroke="var(--color-marca-texto)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="93" cy="372" r="17" fill="var(--color-marca-texto)" stroke="var(--color-marca-fondo)" strokeWidth="6" />
  </svg>;
}

export function FuentesIlustradas() {
  return <svg viewBox="0 0 640 440" fill="none" aria-hidden="true">
    <path d="M20 375h139c83 0 98-280 187-280h300" stroke="var(--color-marca-linea)" strokeWidth="14" />
    <path d="m211 93 244 35-35 260-244-35 35-260Z" fill="var(--color-marca-linea)" stroke="var(--color-marca-fondo)" strokeWidth="6" />
    <path d="m178 63 244 35-35 260-244-35 35-260Z" fill="var(--color-marca-texto)" stroke="var(--color-marca-fondo)" strokeWidth="6" />
    <path d="m214 116 156 22m-163 22 156 22m-163 22 91 13m-98 31 74 10" stroke="var(--color-marca-fondo)" strokeWidth="10" />
    <circle cx="408" cy="288" r="74" fill="var(--color-marca-linea)" stroke="var(--color-marca-fondo)" strokeWidth="7" />
    <path d="m388 295 34-32a18 18 0 0 1 25 26l-16 15m-20-23-33 33a18 18 0 0 1-25-26l16-16" stroke="var(--color-marca-fondo)" strokeWidth="10" strokeLinecap="round" />
    <circle cx="95" cy="375" r="17" fill="var(--color-marca-texto)" stroke="var(--color-marca-fondo)" strokeWidth="6" />
  </svg>;
}
