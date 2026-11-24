import type { Metadata } from "next";

import beneficios from "@/datos/beneficios/beneficios_2027.json";
import plazos from "@/datos/beneficios/plazos_2027.json";
import admision from "@/datos/calendario/plazos_2027.json";

import { BeneficiosCalendario } from "./BeneficiosCalendario";

export const metadata: Metadata = {
  title: "Beneficios y plazos 2027",
  description: "Busca beneficios estudiantiles y revisa los plazos oficiales de postulación y el calendario de admisión universitaria.",
};

export default function PaginaBeneficios() {
  return <BeneficiosCalendario beneficios={beneficios.beneficios} plazos={plazos.plazos} admision={admision.plazos} />;
}
