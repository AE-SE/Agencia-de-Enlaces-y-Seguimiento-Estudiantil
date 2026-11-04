import Image from "next/image";

export default function Inicio() {
  return (
    <div className="portada">
      <header className="marca">
        <Image className="logo" src="/marca/logo-horizontal.svg" alt="Agencia de Enlace & Seguimiento Estudiantil" width={1547} height={314} priority />
      </header>
      <main id="contenido" tabIndex={-1} className="contenido">
        <h1 className="text-titulo">Tu camino a la educación superior</h1>
        <p>Información y acompañamiento para explorar, postular, llegar y avanzar.</p>
      </main>
    </div>
  );
}
