import { notFound } from "next/navigation";
import { CabeceraViaje, Carrusel } from "../../Viaje";
import estilos from "../../Portada.module.css";

export default function PruebaNavegacion() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div className={estilos.portada}>
      <CabeceraViaje />
      <main id="contenido" tabIndex={-1}>
        <section id="explorar" className={estilos.hero}>
          <div className={estilos.heroInterior}>
            <h1>Prueba de navegación</h1>
            <Carrusel />
          </div>
        </section>
        {["comparar", "beneficios", "fuentes"].map(id => (
          <section key={id} id={id} className={estilos.estacion} style={{ minBlockSize: "calc(var(--alto-arte) * 4)" }}>
            <div className={estilos.seccionInterior}>
              <h2>{id}</h2>
              <button type="button">Probar el foco en {id}</button>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
