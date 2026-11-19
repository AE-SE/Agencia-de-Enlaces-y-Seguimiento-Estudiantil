// Pruebas del exportador de la oferta (scripts/exportar-oferta.ts) con datos inventados.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { construirOferta, type DatosBase } from '../../lib/datos/oferta-mapeo.ts';

const base = (): DatosBase => ({
  instituciones: [{ id: 'i1', nombre: 'Instituto Ficticio', tipo: 'instituto_profesional' }],
  programas: [{ id: 'p1', institucion_id: 'i1', nombre: 'Carrera Ficticia' }],
  variantes: [
    {
      id: 'v1',
      programa_id: 'p1',
      programa_generico_id: 'g1',
      codigo_sies: 'I900S1C1J1V1',
      sede: 'Sede A',
      comuna: 'Comuna A',
      region: 'Metropolitana',
      jornada: 'Diurna',
      duracion_semestres: 6,
      fuente_id: 'f1',
    },
  ],
  aranceles: [
    {
      variante_id: 'v1',
      valor_pesos: 1000000,
      periodo: 'año 2026',
      fuente_id: 'f1',
      url: 'https://ejemplo.invalid/mineduc',
      fecha_consulta: '2026-11-05',
      motivo_sin_dato: null,
    },
  ],
  vacantes: [
    {
      variante_id: 'v1',
      via: 'regular',
      cupos: 50,
      periodo: 'admisión 2027',
      fuente_id: 'f2',
      url: 'https://ejemplo.invalid/demre',
      fecha_consulta: '2026-11-05',
      motivo_sin_dato: null,
    },
    {
      variante_id: 'v1',
      via: 'bea',
      cupos: 3,
      periodo: 'admisión 2027',
      fuente_id: 'f2',
      url: 'https://ejemplo.invalid/demre',
      fecha_consulta: '2026-11-05',
      motivo_sin_dato: null,
    },
  ],
  indicadores: [
    {
      programa_generico_id: 'g1',
      tipo: 'retencion_1er_anio',
      valor: 80,
      unidad: 'porcentaje',
      periodo: 'año 2024 a 2025',
      fuente_id: 'f3',
      url: 'https://ejemplo.invalid/sies',
      fecha_consulta: '2026-11-05',
      motivo_sin_dato: null,
    },
    {
      programa_generico_id: 'g1',
      tipo: 'empleabilidad_1er_anio',
      valor: null,
      unidad: 'porcentaje',
      periodo: 'titulados 2021 a 2023',
      fuente_id: 'f3',
      url: 'https://ejemplo.invalid/sies',
      fecha_consulta: '2026-11-05',
      motivo_sin_dato: 'Excepción: indicador de 2.º año.',
    },
  ],
  requisitos: [
    {
      variante_id: 'v1', nem: 10, ranking: 20, competencia_lectora: 20, matematica_1: 20,
      matematica_2: null, historia_cs_sociales: 30, ciencias: 0, historia_o_ciencias: false,
      prueba_especial: null, asignacion_especial_pedagogia: null,
      puntaje_ponderado_minimo: 500, puntaje_promedio_minimo: 458, periodo: 'Admisión 2027',
      fuente_id: 'f2', url: 'https://ejemplo.invalid/demre', fecha_consulta: '2026-11-05',
    },
  ],
  tramos_ingreso: [
    {
      programa_generico_id: 'g1',
      tramo_publicado: 'De $1 millón 600 mil a $1 millón 700 mil',
      periodo: 'titulados 2018 a 2020; pesos de septiembre de 2025',
      fuente_id: 'f3',
      url: 'https://ejemplo.invalid/sies',
      fecha_consulta: '2026-11-05',
      motivo_sin_dato: null,
    },
  ],
  acreditaciones: [],
  indicadores_variante: [],
  fuentes: [
    { id: 'f1', organismo: 'Mineduc', nombre: 'Datos Abiertos Mineduc: matrícula 2026' },
    { id: 'f2', organismo: 'DEMRE', nombre: 'Oferta definitiva' },
    { id: 'f3', organismo: 'SIES, Mineduc', nombre: 'Buscador de Empleabilidad e Ingresos (Mi Futuro)' },
  ],
});

test('una variante se convierte en una carrera con su institución y ubicación', () => {
  const [c] = construirOferta(base());
  assert.equal(c.codigo_sies, 'I900S1C1J1V1');
  assert.equal(c.carrera, 'Carrera Ficticia');
  assert.deepEqual(c.institucion, { nombre: 'Instituto Ficticio', tipo: 'instituto_profesional' });
  assert.equal(c.sede, 'Sede A');
  assert.equal(c.region, 'Metropolitana');
  assert.equal(c.duracion_semestres, 6);
});

test('el arancel sale con su fuente con sigla del portal', () => {
  const [c] = construirOferta(base());
  const arancel = c.indicadores.find((i) => i.tipo === 'arancel_anual');
  assert.ok(arancel);
  assert.equal(arancel.valor, 1000000);
  assert.equal(arancel.fuente, 'Datos Abiertos Mineduc');
  assert.equal(arancel.nivel, 'variante');
});

test('solo se publica la vía regular de cupos', () => {
  const [c] = construirOferta(base());
  const cupos = c.indicadores.filter((i) => i.tipo === 'vacantes');
  assert.equal(cupos.length, 1);
  assert.equal(cupos[0].valor, 50);
  assert.equal(cupos[0].fuente, 'DEMRE');
});

test('un dato del SIES que falta conserva su motivo y no aparece como cero', () => {
  const [c] = construirOferta(base());
  const emp = c.indicadores.find((i) => i.tipo === 'empleabilidad_1er_anio');
  assert.ok(emp);
  assert.equal(emp.valor, null);
  assert.equal((emp as { motivo_sin_dato: string }).motivo_sin_dato, 'Excepción: indicador de 2.º año.');
});

test('los indicadores del SIES cuelgan de la carrera genérica y llevan nivel programa', () => {
  const [c] = construirOferta(base());
  const ret = c.indicadores.find((i) => i.tipo === 'retencion_1er_anio');
  assert.ok(ret);
  assert.equal(ret.valor, 80);
  assert.equal(ret.nivel, 'programa');
  assert.equal(ret.fuente, 'Mi Futuro');
});

test('las ponderaciones DEMRE quedan disponibles para el simulador con su fuente', () => {
  const [c] = construirOferta(base());
  assert.equal(c.requisito_admision?.matematica_1, 20);
  assert.equal(c.requisito_admision?.fuente, 'DEMRE');
});

test('un dato nulo sin motivo se detiene', () => {
  const datos = base();
  datos.aranceles[0] = { ...datos.aranceles[0], valor_pesos: null, motivo_sin_dato: null };
  assert.throws(() => construirOferta(datos), /sin motivo/);
});

test('una variante sin programa se detiene', () => {
  const datos = base();
  datos.variantes[0] = { ...datos.variantes[0], programa_id: 'no-existe' };
  assert.throws(() => construirOferta(datos), /sin programa o institución/);
});

const acreditacion = (cambios: Partial<DatosBase['acreditaciones'][number]> = {}): DatosBase['acreditaciones'][number] => ({
  institucion_id: 'i1',
  estado: 'acreditada',
  anios: 5,
  desde: '2023-01-10',
  hasta: '2028-01-10',
  situacion_al: '2026-11-05',
  periodo: 'matrícula 2026',
  fuente_id: 'f1',
  url: 'https://ejemplo.invalid/mineduc',
  fecha_consulta: '2026-11-05',
  ...cambios,
});

test('la acreditación de la institución llega a la carrera con su fuente y su fecha', () => {
  const [c] = construirOferta({ ...base(), acreditaciones: [acreditacion()] });
  assert.deepEqual(c.institucion.acreditacion, {
    estado: 'acreditada',
    anios: 5,
    desde: '2023-01-10',
    hasta: '2028-01-10',
    situacion_al: '2026-11-05',
    periodo: 'matrícula 2026',
    fuente: 'Datos Abiertos Mineduc',
    url: 'https://ejemplo.invalid/mineduc',
    fecha_consulta: '2026-11-05',
  });
});

test('si hay varias fechas de una misma institución, manda la más reciente', () => {
  const [c] = construirOferta({
    ...base(),
    acreditaciones: [acreditacion({ situacion_al: '2027-03-01', anios: 6 }), acreditacion({ situacion_al: '2026-11-05', anios: 5 })],
  });
  assert.equal(c.institucion.acreditacion?.anios, 6);
  assert.equal(c.institucion.acreditacion?.situacion_al, '2027-03-01');
});

test('una institución no acreditada conserva su estado y no inventa años ni fechas', () => {
  const [c] = construirOferta({ ...base(), acreditaciones: [acreditacion({ estado: 'no_acreditada', anios: null, desde: null, hasta: null })] });
  assert.equal(c.institucion.acreditacion?.estado, 'no_acreditada');
  assert.equal(c.institucion.acreditacion?.anios, null);
  assert.equal(c.institucion.acreditacion?.hasta, null);
});

test('la acreditación de otra institución no se mezcla', () => {
  const [c] = construirOferta({ ...base(), acreditaciones: [acreditacion({ institucion_id: 'otra' })] });
  assert.equal(c.institucion.acreditacion, undefined);
});

const corteDeVariante = (cambios: Partial<DatosBase['indicadores_variante'][number]> = {}): DatosBase['indicadores_variante'][number] => ({
  variante_id: 'v1',
  tipo: 'puntaje_corte',
  valor: 781.4,
  unidad: 'puntos',
  periodo: 'selección del 19 de enero de 2026, vía regular',
  fuente_id: 'f4',
  url: 'https://ejemplo.invalid/datos-abiertos',
  fecha_consulta: '2026-11-17',
  motivo_sin_dato: null,
  ...cambios,
});

const conFuenteDeDatosAbiertos = (datos: DatosBase): DatosBase => ({
  ...datos,
  fuentes: [...datos.fuentes, { id: 'f4', organismo: 'Datos abiertos DEMRE', nombre: 'Postulación y selección, proceso 2026' }],
});

test('el puntaje de corte de una variante llega a su carrera como indicador de variante con su fuente', () => {
  const [c] = construirOferta(conFuenteDeDatosAbiertos({ ...base(), indicadores_variante: [corteDeVariante()] }));
  const corte = c.indicadores.find((i) => i.tipo === 'puntaje_corte');
  assert.ok(corte);
  assert.equal(corte.valor, 781.4);
  assert.equal(corte.nivel, 'variante');
  assert.equal(corte.unidad, 'puntos');
  assert.equal(corte.fuente, 'Datos abiertos DEMRE');
  assert.equal(corte.fecha_consulta, '2026-11-17');
});

test('un puntaje de corte sin valor conserva su motivo y no aparece como cero', () => {
  const [c] = construirOferta(conFuenteDeDatosAbiertos({
    ...base(),
    indicadores_variante: [corteDeVariante({ valor: null, motivo_sin_dato: 'El DEMRE quita registros de sus datos abiertos.' })],
  }));
  const corte = c.indicadores.find((i) => i.tipo === 'puntaje_corte');
  assert.ok(corte);
  assert.equal(corte.valor, null);
  assert.equal((corte as { motivo_sin_dato: string }).motivo_sin_dato, 'El DEMRE quita registros de sus datos abiertos.');
});

test('el puntaje de corte de otra variante no se mezcla', () => {
  const [c] = construirOferta(conFuenteDeDatosAbiertos({ ...base(), indicadores_variante: [corteDeVariante({ variante_id: 'otra' })] }));
  assert.equal(c.indicadores.some((i) => i.tipo === 'puntaje_corte'), false);
});

test('un indicador de variante sin motivo y sin valor se detiene', () => {
  assert.throws(() => construirOferta(conFuenteDeDatosAbiertos({ ...base(), indicadores_variante: [corteDeVariante({ valor: null })] })));
});

test('el ingreso al 4.º año llega como el tramo en palabras que publica el SIES, con su fuente', () => {
  const [c] = construirOferta(base());
  assert.equal(c.ingreso_tramo?.tramo, 'De $1 millón 600 mil a $1 millón 700 mil');
  assert.equal(c.ingreso_tramo?.fuente, 'Mi Futuro');
  assert.equal(c.ingreso_tramo?.motivo_sin_dato, null);
});

test('un tramo sin publicar queda vacío con su motivo, y una carrera sin fila no inventa tramo', () => {
  const sinTramo = base();
  sinTramo.tramos_ingreso[0] = { ...sinTramo.tramos_ingreso[0], tramo_publicado: null, motivo_sin_dato: 'El SIES no publica el ingreso con menos de 10 personas.' };
  assert.equal(construirOferta(sinTramo)[0].ingreso_tramo?.tramo, null);
  assert.match(construirOferta(sinTramo)[0].ingreso_tramo?.motivo_sin_dato ?? '', /menos de 10/);

  const sinFila = base();
  sinFila.tramos_ingreso = [];
  assert.equal(construirOferta(sinFila)[0].ingreso_tramo, undefined);
});

test('la duración formal sale de Mineduc con la fuente del arancel de la misma variante', () => {
  const [c] = construirOferta(base());
  const formal = c.indicadores.find((i) => i.tipo === 'duracion_formal_semestres');
  assert.ok(formal);
  assert.equal(formal.valor, 6);
  assert.equal(formal.unidad, 'semestres');
  assert.equal(formal.fuente, 'Datos Abiertos Mineduc');
});

test('sin arancel no hay fuente que citar y la duración formal no se publica', () => {
  const datos = base();
  datos.aranceles = [];
  assert.equal(construirOferta(datos)[0].indicadores.some((i) => i.tipo === 'duracion_formal_semestres'), false);
});

test('una carrera sin código DEMRE se marca fuera del sistema de admisión; sin dato del código, no se afirma nada', () => {
  const conCodigo = base();
  conCodigo.variantes[0] = { ...conCodigo.variantes[0], codigo_demre: '11080' };
  assert.equal(construirOferta(conCodigo)[0].admision_centralizada, true);

  const sinCodigo = base();
  sinCodigo.variantes[0] = { ...sinCodigo.variantes[0], codigo_demre: null };
  assert.equal(construirOferta(sinCodigo)[0].admision_centralizada, false);

  assert.equal(construirOferta(base())[0].admision_centralizada, undefined);
});

test('el área es la del SIES para la carrera genérica, y no aparece si el SIES no la publica', () => {
  const conArea = base();
  conArea.variantes[0].generica_normalizada = 'enfermeria';
  assert.equal(construirOferta(conArea)[0].area, 'Salud');

  const sinPublicar = base();
  sinPublicar.variantes[0].generica_normalizada = 'otras ingenierias';
  assert.equal('area' in construirOferta(sinPublicar)[0], false);

  assert.equal('area' in construirOferta(base())[0], false);
});
