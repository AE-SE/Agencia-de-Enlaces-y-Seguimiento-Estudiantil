import { CabeceraInterior } from "@/app/_componentes/CabeceraInterior";

export default async function PruebaCabeceras({ searchParams }: { searchParams: Promise<{ pagina?: string }> }) {
  const consulta = await searchParams;
  const pagina = (["carreras", "comparador", "beneficios", "ficha", "simulador", "preguntas"] as const).find(valor => valor === consulta.pagina) ?? "ficha";
  return (
    <div data-pagina-interior>
      <CabeceraInterior pagina={pagina} titulo={pagina === "ficha" ? "Administración de Empresas" : "Prueba de cabecera"} acciones={pagina === "beneficios" ? (
        <a href="#prueba-accion">Revisar plazos de prueba</a>
      ) : undefined}>
        <p>Esta página permite comprobar las variantes de la cabecera compartida.</p>
      </CabeceraInterior>
      <main id="contenido" tabIndex={-1} aria-labelledby="titulo-pagina">
        <div style={{ minBlockSize: "calc(var(--alto-arte) * 4)" }} />
        <button id="prueba-accion" type="button">Probar el foco</button>
      </main>
    </div>
  );
}
