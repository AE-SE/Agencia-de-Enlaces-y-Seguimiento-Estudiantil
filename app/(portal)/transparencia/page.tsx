import type { Metadata } from "next";
import { CircleCheck, Clock, Info } from "lucide-react";

import { DatoOficial } from "@/app/_componentes/DatoOficial";
import { Encabezado } from "@/app/_componentes/Encabezado";
import { Enlace } from "@/app/_componentes/Enlace";
import datos from "@/datos/transparencia/pronostico_2027.json";
import { fechaLarga } from "@/lib/datos/fechas";

import { BarrasHorizontales, GraficoHistograma, Leyenda, RangoEstimado, TablaDatos } from "./Barras";
import {
  cambioEntre,
  decimal,
  miles,
  porcentaje,
  porcentajeConSigno,
  rangoCobertura,
  type Estimacion,
  type PasoComuna,
  type SeriePaes,
  type Tramo,
  type TipoInstitucion,
  type Verificacion,
} from "./transparencia";
import estilos from "./transparencia.module.css";

export const metadata: Metadata = {
  title: "Cómo estimamos las matrículas de 2027",
  description: "Cuántas personas estimamos que entrarán a primer año en 2027, cómo lo calculamos, cuánto nos hemos equivocado antes y cuándo sabremos si acertamos.",
};

const de100 = (fraccion: number) => Math.round(fraccion * 100);

export default function PaginaTransparencia() {
  const [primerAnio, permanencia] = datos.estimaciones as Estimacion[];
  const { insumos } = datos;
  const tipos = datos.retencion_por_tipo.valores as TipoInstitucion[];
  const vn = datos.validacion_nacional;
  const vc = datos.validacion_carrera_sede;
  const tramos = vc.por_tramo as Tramo[];
  const pasos = datos.validacion_comunas.pasos as PasoComuna[];
  const paes = datos.paes.serie as SeriePaes[];
  const calendario = datos.calendario as Verificacion[];
  const rvc = datos.residencia_vs_colegio;

  const saltoFilas = cambioEntre(paes, 2022, 2023, "filas");
  const saltoRegulares = cambioEntre(paes, 2022, 2023, "regulares");
  const recientesPoisson = rangoCobertura(pasos, "cobertura_poisson", 2024);
  const recientesEmpirico = rangoCobertura(pasos, "cobertura_empirico", 2024);
  const pandemia = pasos.find((p) => p.desde === 2020 && p.hasta === 2021);
  const maxPaes = Math.max(...paes.flatMap((s) => [s.filas, s.regulares]));
  const maxError = Math.max(...tramos.map((t) => t.error_mediano));

  return (
    <>
      <Encabezado navegacion={[{ href: "/", texto: "Inicio" }, { href: "/carreras", texto: "Carreras" }]} />
      <main id="contenido" tabIndex={-1} className={estilos.pagina}>
        <header className={estilos.cabecera}>
          <h1>Cómo estimamos las matrículas de 2027 y cuánto nos hemos equivocado</h1>
          <p>Estimamos cuántas personas entrarán a primer año de educación superior en 2027 y cuántas seguirán en segundo año.</p>
          <p>Aquí ves cómo lo hacemos, cuánto nos equivocamos antes y cuándo sabremos si acertamos.</p>
          <nav aria-label="En esta página">
            <ul className={estilos.indice}>
              <li><a href="#estimaciones">Las dos estimaciones</a></li>
              <li><a href="#metodo">Cómo lo calculamos</a></li>
              <li><a href="#limites-uso">Qué no hacemos</a></li>
              <li><a href="#errores">Cuánto nos hemos equivocado</a></li>
              <li><a href="#calendario">Cuándo sabremos si acertamos</a></li>
              <li><a href="#limites">Límites</a></li>
              <li><a href="#fuentes">Fuentes</a></li>
            </ul>
          </nav>
        </header>

        <aside className={estilos.nota} aria-labelledby="nota-titulo">
          <p id="nota-titulo" className={estilos.notaTitulo}><Info className={estilos.icono} aria-hidden="true" /><strong>Importante: todavía no sabemos si acertamos</strong></p>
          <p>Registramos estas cifras el <time dateTime={primerAnio.registrado}>{fechaLarga(primerAnio.registrado)}</time>. Los resultados reales se conocen entre enero de 2027 y agosto de 2028.</p>
          <p>Publicaremos la comparación, salga bien o mal. Si corregimos una cifra, agregamos una versión nueva y explicamos por qué.</p>
        </aside>

        <section id="estimaciones" aria-labelledby="t-estimaciones" className={estilos.seccion}>
          <h2 id="t-estimaciones">Las dos estimaciones</h2>
          <p>Cada cifra viene con un «rango de 95 %». Es el margen de error que damos. Más abajo ves cuántas veces ese tipo de rango contuvo el valor real en pruebas anteriores.</p>
          <div className={estilos.tarjetas}>
            {[
              { e: primerAnio, medida: "Personas que entrarían a primer año de pregrado en 2027, en todo Chile", detalle: "Se matriculan por primera vez en una carrera de pregrado." },
              { e: permanencia, medida: "Personas que seguirían en segundo año en 2028, en todo Chile", detalle: "De quienes entran en 2027, las que seguirían un año después en la misma institución." },
            ].map(({ e, medida, detalle }) => (
              <div key={e.codigo} className={estilos.tarjeta}>
                <DatoOficial
                  medida={medida}
                  valor={e.valor}
                  periodo={`${detalle} Rango de 95 %: entre ${miles(e.inferior)} y ${miles(e.superior)}.`}
                  fuente={{ nombre: e.fuente, url: e.url, fechaActualizacion: e.registrado }}
                />
                <RangoEstimado
                  valor={e.valor}
                  inferior={e.inferior}
                  superior={e.superior}
                  formato={miles}
                  descripcion={`Estimación de ${miles(e.valor)}, con un rango de ${miles(e.inferior)} a ${miles(e.superior)}`}
                />
              </div>
            ))}
          </div>
          <p className={estilos.suave}>«Actualizado» indica la fecha en que registramos cada cifra.</p>
        </section>

        <section id="metodo" aria-labelledby="t-metodo" className={estilos.seccion}>
          <h2 id="t-metodo">Cómo lo calculamos</h2>
          <p>Usamos conteos oficiales por comuna y por año. No usamos datos de personas.</p>
          <ol className={estilos.pasos}>
            <li>
              <h3>1. Contamos a quienes están en cuarto medio</h3>
              <p>En 2026 hay <strong>{miles(insumos.cohorte_residencia.valor)}</strong> estudiantes de cuarto medio. Los contamos por la comuna donde viven, no por la del colegio.</p>
              <p>Las dos comunas pueden ser distintas. En {rvc.comunas_con_diferencia_mayor} de {rvc.comunas_comparadas} comunas grandes, el colegio contaba más de {Math.round(rvc.diferencia_considerada * 100)} % más estudiantes que los que viven ahí. Por eso usamos la residencia.</p>
              <p className={estilos.fuente}>Fuente: <Enlace href={insumos.cohorte_residencia.url}>{insumos.cohorte_residencia.fuente}</Enlace> · Consultada el <time dateTime={insumos.cohorte_residencia.consultado}>{fechaLarga(insumos.cohorte_residencia.consultado)}</time></p>
            </li>
            <li>
              <h3>2. Aplicamos la razón de entrada</h3>
              <p>En el último año observado entraron <strong>{decimal(insumos.tasa_entrada.valor, 1)}</strong> personas a primer año por cada estudiante de cuarto medio del año anterior.</p>
              <p>Es más que 1 porque a primer año también entra gente de otras generaciones. Esta razón se calcula con los datos exactos; aquí la ves redondeada ({decimal(insumos.tasa_entrada.valor, 3)}).</p>
              <p className={estilos.fuente}>Fuente: <Enlace href={insumos.tasa_entrada.url}>{insumos.tasa_entrada.fuente}</Enlace> · Consultada el <time dateTime={insumos.tasa_entrada.consultado}>{fechaLarga(insumos.tasa_entrada.consultado)}</time></p>
            </li>
            <li>
              <h3>3. El resultado es el primer año de 2027</h3>
              <p>Eso da <strong>{miles(primerAnio.valor)}</strong> personas, con un rango de 95 % entre {miles(primerAnio.inferior)} y {miles(primerAnio.superior)}. El rango sale de cuánto cambió esta razón entre un año y otro.</p>
            </li>
            <li>
              <h3>4. Estimamos cuántas seguirán en segundo año</h3>
              <p>Usamos la retención de primer año, como la define la Subsecretaría de Educación Superior: de cada 100 personas que entran a primer año, cuántas siguen matriculadas al año siguiente en la misma institución, sin volver a entrar como estudiantes nuevas. Cambia según el tipo de institución.</p>
              <div className={estilos.tablaCaja} tabIndex={0} role="region" aria-label="Retención de primer año por tipo de institución">
                <table className={estilos.tabla}>
                  <caption>Retención de primer año de quienes entraron en {datos.retencion_por_tipo.cohorte}, y cuántas personas entraron a cada tipo en 2026</caption>
                  <thead><tr><th scope="col">Tipo de institución</th><th scope="col" className={estilos.numerica}>Siguen en segundo año, de cada 100</th><th scope="col" className={estilos.numerica}>Del total que entró en 2026</th></tr></thead>
                  <tbody>
                    {tipos.map((t) => (
                      <tr key={t.clave}><th scope="row">{t.nombre}</th><td className={estilos.numerica}>{decimal(t.retencion * 100, 1)}</td><td className={estilos.numerica}>{porcentaje(t.mezcla_2026)} ({miles(t.ingreso_2026)} personas)</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>Con esa mezcla, la retención promedio es de <strong>{porcentaje(insumos.retencion_ponderada.valor)}</strong>. Entonces estimamos <strong>{miles(permanencia.valor)}</strong> personas en segundo año.</p>
              <p>Para toda la cohorte {datos.retencion_por_tipo.cohorte}, la Subsecretaría informa {porcentaje(datos.retencion_por_tipo.total_cohorte)}. Nuestro {porcentaje(insumos.retencion_ponderada.valor)} sale de ponderar la retención de cada tipo con la mezcla de ingreso de 2026. La diferencia es de {decimal((datos.retencion_por_tipo.total_cohorte - insumos.retencion_ponderada.valor) * 100, 1)} puntos y todavía no la hemos desglosado.</p>
              <p>En 2026, unas {miles(datos.retencion_por_tipo.traspaso_cft_a_ip_aprox)} matrículas de primer año pasaron de un centro de formación técnica al instituto profesional de la misma institución. Eso mueve la mezcla entre tipos, y la retención de 2025 no lo refleja.</p>
              <p>Suponemos que la mezcla entre tipos no cambia en 2028. El rango tampoco incluye un posible cambio de la retención.</p>
              <p className={estilos.fuente}>Fuente de la retención: <Enlace href={datos.retencion_por_tipo.url_informe}>{datos.retencion_por_tipo.fuente}</Enlace> · Consultada el <time dateTime={datos.retencion_por_tipo.consultado}>{fechaLarga(datos.retencion_por_tipo.consultado)}</time>.</p>
              <p className={estilos.fuente}>Fuente de la mezcla de ingreso: <Enlace href={datos.retencion_por_tipo.mezcla_url}>{datos.retencion_por_tipo.mezcla_fuente}</Enlace> · Consultada el <time dateTime={datos.retencion_por_tipo.mezcla_consultado}>{fechaLarga(datos.retencion_por_tipo.mezcla_consultado)}</time>.</p>
            </li>
          </ol>
        </section>

        <section id="limites-uso" aria-labelledby="t-limites-uso" className={estilos.seccion}>
          <h2 id="t-limites-uso">Qué no hacemos</h2>
          <ul className={estilos.lista}>
            <li>No usamos datos de personas. Todo sale de conteos oficiales por comuna y por año.</li>
            <li>No decimos qué le pasará a un estudiante. Estas cifras describen a grupos grandes.</li>
            <li>No ordenamos ni destacamos instituciones.</li>
            <li>No mostramos las cifras por sexo, edad ni situación socioeconómica.</li>
          </ul>
        </section>

        <section id="errores" aria-labelledby="t-errores" className={estilos.seccion}>
          <h2 id="t-errores">Cuánto nos hemos equivocado</h2>
          <p>Para saber si el método sirve, lo repetimos hacia atrás. Calculamos cada año con los datos que había entonces y comparamos con lo que pasó.</p>

          <h3>En todo Chile</h3>
          <p>De {vn.periodo}, el primer año estimado se desvió entre <strong>{porcentajeConSigno(vn.error_minimo)}</strong> y <strong>{porcentajeConSigno(vn.error_maximo)}</strong> de lo observado. Son cinco años de prueba: es una señal, no una garantía.</p>
          <p className={estilos.fuente}>Fuente: <Enlace href={vn.url}>{vn.fuente}</Enlace> · Consultada el <time dateTime={vn.consultado}>{fechaLarga(vn.consultado)}</time>.</p>

          <h3>Por carrera y sede: el margen es amplio</h3>
          <p>Hicimos la misma prueba con <strong>{miles(vc.casos)}</strong> casos de carreras y sedes con {vc.minimo_entrantes} o más estudiantes nuevos. El error típico (mediana) fue de <strong>{porcentaje(vc.error_mediano)}</strong>.</p>
          <p>El rango de 95 % contuvo el valor real en {porcentaje(vc.cobertura)} de los casos. Pero es ancho: el valor real estuvo entre {decimal(vc.factor_bajo, 1)} y {decimal(vc.factor_alto, 1)} veces lo estimado.</p>
          <p><strong>Por eso aquí no publicamos cifras por carrera ni por sede.</strong> Sirven como cifra aproximada, no para decidir algo concreto. Además, la prueba supone que ya conocíamos el total del año, así que es más optimista que la realidad.</p>

          <figure className={estilos.grafico}>
            <figcaption>Dónde cae el error en esos {miles(vc.casos)} casos</figcaption>
            <Leyenda items={[{ texto: "Dentro del rango de 95 %", tipo: "barra" }, { texto: "Fuera del rango", tipo: "fuera" }]} />
            <GraficoHistograma
              descripcion="Distribución del error de las estimaciones por carrera y sede. La mayoría de los casos queda cerca de cero, y el 95 % central está entre los dos cortes."
              h={vc.histograma}
              qBajo={vc.q_bajo}
              qAlto={vc.q_alto}
              etiquetaBajo="2,5 %"
              etiquetaAlto="97,5 %"
              ticks={[-1.5, -1, -0.5, 0, 0.5, 1, 1.5].map((v) => ({ valor: v, texto: v === 0 ? "0" : `${v < 0 ? "−" : ""}${decimal(Math.abs(v), Number.isInteger(v) ? 0 : 1)}` }))}
            />
            <p className={estilos.pieGrafico}>El cero es un acierto exacto. A la izquierda, el valor real fue mayor que el estimado; a la derecha, menor. Cada columna agrupa los casos con un error parecido. Fuera del gráfico quedan {miles(vc.histograma.fuera_bajo + vc.histograma.fuera_alto)} casos. Fuente: <Enlace href={vc.url}>{vc.fuente}</Enlace> · Consultada el <time dateTime={vc.consultado}>{fechaLarga(vc.consultado)}</time>.</p>
          </figure>

          <figure className={estilos.grafico}>
            <figcaption>Las carreras y sedes más pequeñas son más difíciles de estimar</figcaption>
            <BarrasHorizontales
              descripcion="Error típico según la cantidad de estudiantes nuevos de la carrera y sede"
              maximo={maxError}
              filas={tramos.map((t) => ({ etiqueta: `${t.tramo} estudiantes nuevos`, valor: t.error_mediano, texto: porcentaje(t.error_mediano) }))}
            />
            <TablaDatos
              resumen="Ver los números en una tabla"
              titulo="Error y cobertura según el tamaño de la carrera y sede"
              columnas={[{ nombre: "Estudiantes nuevos" }, { nombre: "Casos", numerica: true }, { nombre: "Error típico", numerica: true }, { nombre: "Rango de 95 % contuvo el valor real", numerica: true }]}
              filas={tramos.map((t) => [t.tramo, miles(t.casos), porcentaje(t.error_mediano), porcentaje(t.cobertura)])}
            />
          </figure>

          <h3>Un error que corregimos: cómo contamos a quienes rinden la prueba de acceso</h3>
          <p>Las pruebas de acceso a la educación superior las administra el Departamento de Evaluación, Medición y Registro Educacional (DEMRE). Hoy se llaman Prueba de Acceso a la Educación Superior (PAES). Al principio contábamos las filas de su archivo.</p>
          <p>Eso incluía a quienes solo rindieron la prueba de invierno. Mostraba un salto de <strong>{porcentajeConSigno(saltoFilas)}</strong> entre 2022 y 2023. Contando solo a quienes rindieron la prueba regular, el cambio fue de <strong>{porcentajeConSigno(saltoRegulares)}</strong>.</p>
          <figure className={estilos.grafico}>
            <figcaption>Dos formas de contar a quienes rinden la prueba de acceso, por año</figcaption>
            <Leyenda items={[{ texto: "Filas del archivo (incluye solo invierno)", tipo: "trama" }, { texto: "Rendidores de la prueba regular (lo que usamos)", tipo: "barra" }]} />
            {paes.map((s) => (
              <div key={s.anio} className={estilos.grupo}>
                <p className={estilos.grupoTitulo}>{s.anio}</p>
                <BarrasHorizontales
                  descripcion={`Año ${s.anio}`}
                  maximo={maxPaes}
                  filas={[
                    { etiqueta: "Filas del archivo", valor: s.filas, texto: miles(s.filas), trama: true },
                    { etiqueta: "Prueba regular", valor: s.regulares, texto: miles(s.regulares) },
                  ]}
                />
              </div>
            ))}
            <p className={estilos.pieGrafico}>Contamos como quien rindió la prueba a quien tiene al menos un puntaje de la prueba regular distinto de vacío y de cero. El DEMRE confirmó esta definición. Fuente: <Enlace href={datos.paes.url}>{datos.paes.fuente}</Enlace> · Consultada el <time dateTime={datos.paes.consultado}>{fechaLarga(datos.paes.consultado)}</time>.</p>
          </figure>

          <h3>Un rango que descartamos</h3>
          <p>Probamos primero un rango estadístico simple que decía «95 %». Entre 2023 y 2026 solo contuvo el valor real entre <strong>{de100(recientesPoisson.minimo)}</strong> y <strong>{de100(recientesPoisson.maximo)}</strong> veces de cada 100. Lo descartamos.</p>
          <p>Lo cambiamos por un rango calculado con los cambios reales entre años. En los mismos pasos contuvo el valor real entre <strong>{de100(recientesEmpirico.minimo)}</strong> y <strong>{de100(recientesEmpirico.maximo)}</strong> veces de cada 100.{pandemia && pandemia.cobertura_empirico !== null ? <> El paso de 2020 a 2021, por la pandemia, quedó en {de100(pandemia.cobertura_empirico)}: fue un cambio que ningún otro año tenía.</> : null}</p>
          <figure className={estilos.grafico}>
            <figcaption>Cuántas veces de cada 100 contuvo el rango el valor real, por cambio de año</figcaption>
            <Leyenda items={[{ texto: "Rango simple (descartado)", tipo: "trama" }, { texto: "Rango con cambios reales (adoptado)", tipo: "barra" }, { texto: "95 % que se declara", tipo: "referencia" }]} />
            {pasos.map((p) => (
              <div key={`${p.desde}-${p.hasta}`} className={estilos.grupo}>
                <p className={estilos.grupoTitulo}>De {p.desde} a {p.hasta}</p>
                <BarrasHorizontales
                  descripcion={`De ${p.desde} a ${p.hasta}`}
                  maximo={1}
                  referencia={0.95}
                  filas={[
                    { etiqueta: "Rango simple", valor: p.cobertura_poisson, texto: `${de100(p.cobertura_poisson)} de 100`, trama: true },
                    ...(p.cobertura_empirico !== null ? [{ etiqueta: "Rango adoptado", valor: p.cobertura_empirico, texto: `${de100(p.cobertura_empirico)} de 100` }] : []),
                  ]}
                />
              </div>
            ))}
            <p className={estilos.pieGrafico}>El rango adoptado se calcula con los demás pasos y se mide en el que quedó fuera. Fuente: {datos.validacion_comunas.fuente}. Enlaces: <Enlace href={insumos.cohorte_residencia.url}>Mineduc</Enlace> y <Enlace href={datos.paes.url}>DEMRE</Enlace> · Consultada el <time dateTime={datos.validacion_comunas.consultado}>{fechaLarga(datos.validacion_comunas.consultado)}</time>.</p>
          </figure>
        </section>

        <section id="calendario" aria-labelledby="t-calendario" className={estilos.seccion}>
          <h2 id="t-calendario">Cuándo sabremos si acertamos</h2>
          <p>Cuando se publiquen estos resultados, los compararemos con nuestras estimaciones.</p>
          <div className={estilos.tablaCaja} tabIndex={0} role="region" aria-label="Calendario de comparaciones">
            <table className={estilos.tabla}>
              <caption>Qué compararemos y cuándo</caption>
              <thead><tr><th scope="col">Qué comparamos</th><th scope="col">Cuándo se sabrá</th><th scope="col">Estado de la fecha</th></tr></thead>
              <tbody>
                {calendario.map((c) => (
                  <tr key={c.comparacion}>
                    <th scope="row">{c.comparacion}</th>
                    <td>{c.cuando}</td>
                    <td>
                      <span className={`${estilos.estado} ${c.estado === "confirmada" ? estilos.estadoOk : estilos.estadoEspera}`}>
                        {c.estado === "confirmada" ? <CircleCheck className={estilos.icono} aria-hidden="true" /> : <Clock className={estilos.icono} aria-hidden="true" />}
                        {c.estado === "confirmada" ? "Fecha confirmada" : "Fecha por confirmar"}
                      </span>
                      <span className={estilos.detalleEstado}>{c.detalle}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="limites" aria-labelledby="t-limites" className={estilos.seccion}>
          <h2 id="t-limites">Límites que debes tener presentes</h2>
          <ul className={estilos.lista}>
            <li>Son cinco años de prueba. Es poco para asegurar que el método seguirá funcionando.</li>
            <li>Por carrera y sede, el valor más alto del rango es unas {decimal(vc.ancho_mediano, 1)} veces el más bajo. Es una cifra aproximada.</li>
            <li>La prueba por carrera y sede supone que conocíamos el total del año. Con el total incierto, el rango acertaría menos veces de las que mostramos.</li>
            <li>Suponemos que la mezcla entre universidades, institutos profesionales y centros de formación técnica no cambia en 2028.</li>
            <li>La mezcla de 2026 está influida por el paso de unas {miles(datos.retencion_por_tipo.traspaso_cft_a_ip_aprox)} matrículas de un centro de formación técnica a un instituto profesional. La retención por tipo es de la cohorte 2025 y no incluye ese cambio.</li>
            <li>Las cifras de matrícula del Ministerio de Educación (Mineduc) se cuentan al 30 de abril de cada año.</li>
          </ul>
        </section>

        <section id="fuentes" aria-labelledby="t-fuentes" className={estilos.seccion}>
          <h2 id="t-fuentes">Fuentes</h2>
          <p>Todo viene de datos abiertos. Los datos se procesaron el <time dateTime={datos.fecha_datos}>{fechaLarga(datos.fecha_datos)}</time>.</p>
          <ul className={estilos.lista}>
            {datos.fuentes.map((f) => (
              <li key={f.url}><Enlace href={f.url}>{f.nombre}</Enlace> {f.nota ? <span className={estilos.suave}>· {f.nota}</span> : null}</li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
