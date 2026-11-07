import type { Metadata } from "next";

import beneficios from "@/datos/beneficios/beneficios_2027.json";
import plazos from "@/datos/beneficios/plazos_2027.json";

import { BeneficiosCalendario } from "./BeneficiosCalendario";

export const metadata: Metadata = {
  title: "Beneficios y plazos 2027",
  description: "Busca beneficios estudiantiles y revisa los plazos oficiales de postulación.",
};

export default function PaginaBeneficios() {
  return <BeneficiosCalendario beneficios={beneficios.beneficios} plazos={plazos.plazos} />;
}
