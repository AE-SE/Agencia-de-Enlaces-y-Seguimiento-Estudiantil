// Carga lotes SQL de la oferta oficial en la base (Supabase), uno por uno y cada uno en una sola transacción.
//
// Por qué existe: el editor SQL de Supabase no admite archivos de varios MB y en el computador del líder no hay `psql`.
// Hace lo mismo que `psql -v ON_ERROR_STOP=1 -f archivo.sql`, con tres cuidados más: comprueba que la base ya tiene la
// oferta (lotes 1 a 6), carga cada archivo en una transacción (si algo falla, no queda nada a medias) y muestra los
// conteos de antes y después.
//
// Uso (la cadena de conexión tiene la contraseña: va en una variable de entorno, nunca en un chat ni en el repositorio):
//
//   npm install --no-save pg
//   $env:SUPABASE_DB_URL = "postgresql://..."        # PowerShell; en bash: export SUPABASE_DB_URL="postgresql://..."
//   node scripts/cargar-lotes.mjs --simular           # comprueba archivos y conexión y no escribe nada
//   node scripts/cargar-lotes.mjs 12 13 14 15         # carga los lotes 12, 13, 14 y 15, en ese orden
//
// Los lotes son repetibles (`on conflict ... do nothing`): correrlos dos veces no duplica filas.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let pg;
try {
  pg = require('pg');
} catch {
  console.error('Falta la librería «pg». Instálala sin tocar package.json: npm install --no-save pg');
  process.exit(1);
}

const CARPETA = resolve(import.meta.dirname, '..', 'datos', 'procesados', 'lotes');
const ARCHIVOS = {
  1: '01_fuentes', 2: '02_instituciones', 3: '03_programas_genericos', 4: '04_programas', 5: '05_variantes', 6: '06_aranceles',
  7: '07_indicadores_sies', 8: '08_ingresos_sies', 9: '09_vacantes_demre', 10: '10_requisitos_demre',
  12: '12_acreditaciones', 13: '13_puntajes_corte', 14: '14_matricula_inscripcion', 15: '15_matricula_total',
};

const args = process.argv.slice(2);
const simular = args.includes('--simular');
const numeros = args.filter((a) => /^\d+$/.test(a)).map(Number);
if (!numeros.length) {
  console.error('Indica qué lotes cargar, por ejemplo: node scripts/cargar-lotes.mjs 12 13 14 15 (o --simular para probar sin escribir).');
  process.exit(1);
}
for (const n of numeros) {
  if (!ARCHIVOS[n]) { console.error(`El lote ${n} no existe. Lotes: ${Object.keys(ARCHIVOS).join(', ')}.`); process.exit(1); }
  if (!existsSync(resolve(CARPETA, `${ARCHIVOS[n]}.sql`))) { console.error(`Falta el archivo ${ARCHIVOS[n]}.sql en datos/procesados/lotes/.`); process.exit(1); }
}

const cadena = process.env.SUPABASE_DB_URL;
if (!cadena) { console.error('Falta la variable de entorno SUPABASE_DB_URL con la cadena de conexión (Supabase → Connect).'); process.exit(1); }
// Contra localhost (pruebas) no se usa TLS; contra Supabase sí.
const local = /@(localhost|127\.0\.0\.1)[:/]/.test(cadena);
const cliente = new pg.Client({ connectionString: cadena, ssl: local ? false : { rejectUnauthorized: false } });

const CONTEOS = `
  select 'variantes' as dato, count(*)::int as n from programa_variante
  union all select 'acreditaciones', count(*)::int from acreditacion_institucion
  union all select 'puntaje_corte', count(*)::int from indicador where tipo = 'puntaje_corte'
  union all select 'matricula_inscripcion', count(*)::int from indicador where tipo = 'matricula_inscripcion'
  union all select 'matricula', count(*)::int from indicador where tipo = 'matricula'
  union all select 'vacantes', count(*)::int from vacante_admision
  union all select 'requisitos', count(*)::int from requisito_admision
  union all select 'indicadores_sies', count(*)::int from indicador where programa_generico_id is not null
  union all select 'tramos_ingreso', count(*)::int from tramo_ingreso_sies
  order by 1`;

async function conteos() {
  const { rows } = await cliente.query(CONTEOS);
  return Object.fromEntries(rows.map((f) => [f.dato, f.n]));
}

try {
  await cliente.connect();
} catch (e) {
  console.error(`No pude conectar con la base: ${e.code ?? e.message}. Revisa la cadena de conexión (no se muestra por seguridad).`);
  process.exit(1);
}

try {
  const antes = await conteos();
  console.log('Antes:', antes);
  if (antes.variantes === 0) {
    console.error('La base no tiene la oferta (0 variantes): cargar primero los lotes 1 a 6. No se cargó nada.');
    process.exitCode = 1;
  } else if (simular) {
    console.log(`Simulación: conexión correcta y archivos presentes (${numeros.map((n) => ARCHIVOS[n]).join(', ')}). No se escribió nada.`);
  } else {
    for (const n of numeros) {
      const nombre = ARCHIVOS[n];
      const sql = readFileSync(resolve(CARPETA, `${nombre}.sql`), 'utf8');
      const inicio = Date.now();
      try {
        await cliente.query('begin');
        await cliente.query(sql);
        await cliente.query('commit');
        console.log(`OK ${nombre} (${((Date.now() - inicio) / 1000).toFixed(1)} s)`);
      } catch (e) {
        await cliente.query('rollback').catch(() => {});
        console.error(`FALLA ${nombre}: ${e.message}. Se deshizo ese lote y se detuvo la carga.`);
        process.exitCode = 1;
        break;
      }
    }
    console.log('Después:', await conteos());
  }
} finally {
  await cliente.end();
}
