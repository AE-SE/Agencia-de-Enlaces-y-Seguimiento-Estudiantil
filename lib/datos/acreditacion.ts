// Cómo se explica la acreditación de una institución en la ficha de sus carreras.
// Los datos llegan de Mineduc (lib/datos/carreras.ts, AcreditacionInstitucion). Aquí solo se
// ordenan en frases. La acreditación es una situación fechada: siempre se dice a qué fecha
// corresponde y dónde confirmar la vigente.
import type { AcreditacionInstitucion } from './carreras.ts';
import { fechaLarga } from './fechas.ts';
import type { TipoInstitucion } from './tipos.ts';

export type EnlaceDeAcreditacion = { texto: string; href: string };

export type VistaDeAcreditacion = {
  // Lo que se lee grande: «7 años», «No acreditada», «Bajo tutela».
  valor: string;
  detalles: string[];
  // Algo que la persona debe saber antes de fiarse del dato (por ejemplo, que ya terminó).
  aviso?: string;
  enlaces: EnlaceDeAcreditacion[];
};

export const ENLACE_CNA: EnlaceDeAcreditacion = { texto: 'Confirmar en el sitio de la CNA', href: 'https://www.cnachile.cl/' };
// Ley 20.910, que crea los quince centros de formación técnica estatales; su artículo tercero los pone bajo tutela.
export const ENLACE_LEY_20910: EnlaceDeAcreditacion = { texto: 'Ley 20.910, en LeyChile', href: 'https://www.bcn.cl/leychile/navegar?idNorma=1088775' };

export function describirAcreditacion(acreditacion: AcreditacionInstitucion, tipo: TipoInstitucion, hoy: string): VistaDeAcreditacion {
  const nota = `Situación informada al ${fechaLarga(acreditacion.situacion_al)}. La acreditación puede cambiar.`;
  const enlaces = [ENLACE_CNA];

  if (acreditacion.estado === 'no_acreditada') {
    return { valor: 'No acreditada', detalles: ['Mineduc informa que la institución no está acreditada.', nota], enlaces };
  }

  if (acreditacion.estado === 'bajo_tutela') {
    const detalles = ['Mineduc informa esta institución como «bajo tutela».'];
    if (tipo === 'centro_formacion_tecnica') {
      detalles.push('Los centros de formación técnica estatales son tutelados y acompañados por una universidad del Estado.');
      enlaces.push(ENLACE_LEY_20910);
    }
    return { valor: 'Bajo tutela', detalles: [...detalles, nota], enlaces };
  }

  const anios = acreditacion.anios;
  const duracion = anios === null ? '' : ` por ${anios} ${anios === 1 ? 'año' : 'años'}`;
  const rango = acreditacion.desde && acreditacion.hasta
    ? `desde el ${fechaLarga(acreditacion.desde)} hasta el ${fechaLarga(acreditacion.hasta)}`
    : acreditacion.hasta ? `hasta el ${fechaLarga(acreditacion.hasta)}` : '';
  const termino = acreditacion.hasta;

  // Una fecha de término ya pasada se dice en el titular y en el aviso: no se muestra como si siguiera vigente.
  if (termino && termino < hoy) {
    return {
      valor: 'Terminada',
      detalles: [`Estuvo acreditada${duracion} ${rango}.`, nota],
      aviso: `La acreditación terminó el ${fechaLarga(termino)}. Revisa si se renovó.`,
      enlaces,
    };
  }

  const detalles = rango ? [`Acreditada ${rango}.`, nota] : [nota];
  return { valor: anios === null ? 'Acreditada' : `${anios} ${anios === 1 ? 'año' : 'años'}`, detalles, enlaces };
}
