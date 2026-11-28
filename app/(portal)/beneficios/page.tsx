import type { Metadata } from "next";

import beneficios from "@/datos/beneficios/beneficios_2027.json";
import plazos from "@/datos/beneficios/plazos_2027.json";
import admision from "@/datos/calendario/plazos_2027.json";

import { hoyEnChile } from "./beneficios";
import { BeneficiosCalendario } from "./BeneficiosCalendario";

// En vivo, como la portada: el calendario separa lo que ya pasó según la fecha de hoy en Chile.
// Solo lee archivos de datos del repositorio, sin consultas a la base.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beneficios y plazos 2027",
  description: "Busca beneficios estudiantiles y revisa los plazos oficiales de postulación y el calendario de admisión universitaria.",
};

export default function PaginaBeneficios() {
  return <BeneficiosCalendario beneficios={beneficios.beneficios} plazos={plazos.plazos} admision={admision.plazos} hoy={hoyEnChile()} />;
}
