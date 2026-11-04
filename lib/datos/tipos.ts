// Tipos de la base de datos, escritos a mano a partir de
// las migraciones de supabase/migrations/ (esquema base y variantes de programa).
//
// Por qué a mano: todavía no existe el proyecto Next.js (tarea A1) ni la línea de
// comandos de Supabase en el repositorio. La forma es la misma que produce
// `supabase gen types typescript`, para que más adelante este archivo se pueda
// reemplazar por el generado sin tocar el resto del código.
//
// Regla: toda migración nueva que cambie una tabla, un tipo o una función debe
// actualizar este archivo en el mismo PR.
//
// Convenciones de PostgreSQL → TypeScript (las mismas de Supabase):
// uuid, text, date y timestamptz → string (fechas en formato ISO);
// smallint, bigint y numeric → number; jsonb → Json.
// Los permisos y las políticas RLS NO se reflejan aquí: que una tabla tenga tipo
// Insert no significa que el rol pueda insertar. Eso lo decide la base.

export type Json = string | number | boolean | null | { [clave: string]: Json | undefined } | Json[];

// ---------------------------------------------------------------------------
// Tipos enumerados
// ---------------------------------------------------------------------------

export type TipoInstitucion = 'universidad' | 'instituto_profesional' | 'centro_formacion_tecnica';

export type TipoIndicador =
  | 'empleabilidad_1er_anio'
  | 'empleabilidad_2do_anio'
  | 'ingreso_promedio_4to_anio'
  | 'arancel_anual'
  | 'matricula'
  | 'vacantes'
  | 'puntaje_corte'
  | 'retencion_1er_anio'
  | 'duracion_real_semestres';

export type UnidadIndicador = 'porcentaje' | 'pesos' | 'puntos' | 'semestres' | 'cupos' | 'estudiantes';

export type TipoOrganizacion = 'agencia' | 'institucion';

export type RolMiembro = 'administrador' | 'acompanante' | 'lector';

export type FinalidadConsentimiento = 'compartir_ficha' | 'datos_socioeconomicos' | 'acompanamiento_bienestar';

export type TipoSeguimiento = 'nota' | 'senal_alerta' | 'contacto';

// ---------------------------------------------------------------------------
// A. Datos públicos oficiales
// ---------------------------------------------------------------------------

type FilaFuente = {
  id: string;
  organismo: string;
  nombre: string;
  url: string;
  terminos_de_uso: string | null;
  terminos_revisados_el: string | null;
  creada_el: string;
};

type FilaInstitucion = {
  id: string;
  codigo_oficial: string; // texto: conserva ceros a la izquierda
  nombre: string;
  tipo: TipoInstitucion;
  anios_acreditacion: number | null;
  acreditada_hasta: string | null;
  fuente_acreditacion_id: string | null;
  actualizada_el: string;
};

// Carrera + institución: la fila del listado (ADR 0011).
type FilaPrograma = {
  id: string;
  institucion_id: string;
  nombre: string;
  area: string | null;
  fuente_id: string;
  actualizada_el: string;
};

// Cada combinación de sede y jornada de un programa, con su propio código SIES.
type FilaProgramaVariante = {
  id: string;
  programa_id: string;
  codigo_sies: string;
  sede: string | null;
  comuna: string | null;
  region: string | null;
  jornada: string | null;
  direccion: string | null;
  duracion_semestres: number | null;
  fuente_id: string;
  actualizada_el: string;
};

// Sin dato NO es cero: si `valor` es null, `motivo_sin_dato` dice por qué.
// `variante_id` null = la fuente publica el dato para el programa completo.
type FilaIndicador = {
  id: string;
  programa_id: string;
  variante_id: string | null;
  tipo: TipoIndicador;
  valor: number | null;
  unidad: UnidadIndicador;
  periodo: string;
  fuente_id: string;
  url: string;
  fecha_consulta: string;
  motivo_sin_dato: string | null;
};

type FilaBeneficio = {
  id: string;
  nombre: string;
  explicacion_simple: string;
  requisitos_simples: string | null;
  requisitos_oficiales: string | null;
  fuente_id: string;
  url: string;
  vigente_desde: string;
  vigente_hasta: string | null;
  fecha_consulta: string;
};

type FilaPlazo = {
  id: string;
  beneficio_id: string | null;
  proceso: string;
  descripcion: string;
  inicio: string;
  termino: string;
  fuente_id: string;
  url: string;
  fecha_consulta: string;
};

// ---------------------------------------------------------------------------
// B. Datos de personas
// ---------------------------------------------------------------------------

type FilaOrganizacion = {
  id: string;
  nombre: string;
  tipo: TipoOrganizacion;
  institucion_id: string | null;
  creada_el: string;
};

type FilaMiembro = {
  organizacion_id: string;
  usuario_id: string;
  rol: RolMiembro;
  creado_el: string;
};

type FilaPersona = {
  id: string;
  nombre: string;
  fecha_nacimiento: string;
  region: string | null;
  creada_el: string;
};

type FilaAutorizacionTutor = {
  persona_id: string;
  nombre_tutor: string;
  contacto_tutor: string;
  otorgada_el: string;
  metodo: string;
};

type FilaFichaTrayectoria = {
  persona_id: string;
  intereses: Json;
  simulaciones: Json;
  beneficios_postulados: Json;
  actualizada_el: string;
};

type FilaConsentimiento = {
  id: string;
  persona_id: string;
  organizacion_id: string;
  finalidad: FinalidadConsentimiento;
  otorgado_el: string;
  revocado_el: string | null;
};

// Dato sensible. No se lee directo: solo con la función ver_seguimientos().
type FilaSeguimiento = {
  id: string;
  persona_id: string;
  organizacion_id: string;
  autor_id: string;
  tipo: TipoSeguimiento;
  contenido: string;
  creado_el: string;
};

type FilaRegistroAcceso = {
  id: number;
  usuario_id: string;
  persona_id: string;
  tabla: string;
  accion: string;
  ocurrido_el: string;
};

// ---------------------------------------------------------------------------
// Ayudas para armar Insert y Update a partir de la fila
// ---------------------------------------------------------------------------

// Las columnas con valor por defecto en la base pasan a ser opcionales al insertar.
type ParaInsertar<Fila, ConDefecto extends keyof Fila> = Omit<Fila, ConDefecto> & Partial<Pick<Fila, ConDefecto>>;

type Tabla<Fila, ConDefecto extends keyof Fila, Relaciones extends Relacion[] = []> = {
  Row: Fila;
  Insert: ParaInsertar<Fila, ConDefecto>;
  Update: Partial<Fila>;
  Relationships: Relaciones;
};

type Relacion = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

// Nombres de las llaves foráneas tal como los crea PostgreSQL (<tabla>_<columna>_fkey).
// supabase-js los usa para tipar las consultas que unen tablas.
type Fk<Nombre extends string, Columna extends string, Destino extends string, UnoAUno extends boolean = false> = {
  foreignKeyName: Nombre;
  columns: [Columna];
  isOneToOne: UnoAUno;
  referencedRelation: Destino;
  referencedColumns: ['id'];
};

// Llave foránea de dos columnas: el indicador apunta a una variante de su mismo programa.
type FkVarianteDelPrograma = {
  foreignKeyName: 'indicador_variante_del_programa';
  columns: ['variante_id', 'programa_id'];
  isOneToOne: false;
  referencedRelation: 'programa_variante';
  referencedColumns: ['id', 'programa_id'];
};

// ---------------------------------------------------------------------------
// Base de datos completa (forma esperada por createClient<Database> de supabase-js)
// ---------------------------------------------------------------------------

export type Database = {
  public: {
    Tables: {
      fuente: Tabla<FilaFuente, 'id' | 'terminos_de_uso' | 'terminos_revisados_el' | 'creada_el'>;
      institucion: Tabla<
        FilaInstitucion,
        'id' | 'anios_acreditacion' | 'acreditada_hasta' | 'fuente_acreditacion_id' | 'actualizada_el',
        [Fk<'institucion_fuente_acreditacion_id_fkey', 'fuente_acreditacion_id', 'fuente'>]
      >;
      programa: Tabla<
        FilaPrograma,
        'id' | 'area' | 'actualizada_el',
        [
          Fk<'programa_institucion_id_fkey', 'institucion_id', 'institucion'>,
          Fk<'programa_fuente_id_fkey', 'fuente_id', 'fuente'>,
        ]
      >;
      programa_variante: Tabla<
        FilaProgramaVariante,
        'id' | 'sede' | 'comuna' | 'region' | 'jornada' | 'direccion' | 'duracion_semestres' | 'actualizada_el',
        [
          Fk<'programa_variante_programa_id_fkey', 'programa_id', 'programa'>,
          Fk<'programa_variante_fuente_id_fkey', 'fuente_id', 'fuente'>,
        ]
      >;
      indicador: Tabla<
        FilaIndicador,
        'id' | 'variante_id' | 'valor' | 'motivo_sin_dato',
        [
          Fk<'indicador_programa_id_fkey', 'programa_id', 'programa'>,
          FkVarianteDelPrograma,
          Fk<'indicador_fuente_id_fkey', 'fuente_id', 'fuente'>,
        ]
      >;
      beneficio: Tabla<
        FilaBeneficio,
        'id' | 'requisitos_simples' | 'requisitos_oficiales' | 'vigente_hasta',
        [Fk<'beneficio_fuente_id_fkey', 'fuente_id', 'fuente'>]
      >;
      plazo: Tabla<
        FilaPlazo,
        'id' | 'beneficio_id',
        [
          Fk<'plazo_beneficio_id_fkey', 'beneficio_id', 'beneficio'>,
          Fk<'plazo_fuente_id_fkey', 'fuente_id', 'fuente'>,
        ]
      >;
      organizacion: Tabla<
        FilaOrganizacion,
        'id' | 'institucion_id' | 'creada_el',
        [Fk<'organizacion_institucion_id_fkey', 'institucion_id', 'institucion'>]
      >;
      miembro: Tabla<
        FilaMiembro,
        'creado_el',
        [Fk<'miembro_organizacion_id_fkey', 'organizacion_id', 'organizacion'>]
      >;
      persona: Tabla<FilaPersona, 'region' | 'creada_el'>;
      autorizacion_tutor: Tabla<
        FilaAutorizacionTutor,
        'otorgada_el',
        [Fk<'autorizacion_tutor_persona_id_fkey', 'persona_id', 'persona', true>]
      >;
      ficha_trayectoria: Tabla<
        FilaFichaTrayectoria,
        'intereses' | 'simulaciones' | 'beneficios_postulados' | 'actualizada_el',
        [Fk<'ficha_trayectoria_persona_id_fkey', 'persona_id', 'persona', true>]
      >;
      consentimiento: Tabla<
        FilaConsentimiento,
        'id' | 'otorgado_el' | 'revocado_el',
        [
          Fk<'consentimiento_persona_id_fkey', 'persona_id', 'persona'>,
          Fk<'consentimiento_organizacion_id_fkey', 'organizacion_id', 'organizacion'>,
        ]
      >;
      seguimiento: Tabla<
        FilaSeguimiento,
        'id' | 'creado_el',
        [
          Fk<'seguimiento_persona_id_fkey', 'persona_id', 'persona'>,
          Fk<'seguimiento_organizacion_id_fkey', 'organizacion_id', 'organizacion'>,
        ]
      >;
      registro_acceso: Tabla<FilaRegistroAcceso, 'id' | 'ocurrido_el'>;
    };
    Views: { [_ in never]: never };
    Functions: {
      ver_seguimientos: {
        Args: { p_persona: string };
        Returns: Pick<FilaSeguimiento, 'id' | 'organizacion_id' | 'tipo' | 'contenido' | 'creado_el'>[];
      };
      es_miembro: { Args: { p_organizacion: string }; Returns: boolean };
      tiene_consentimiento: {
        Args: { p_persona: string; p_organizacion: string; p_finalidad: FinalidadConsentimiento };
        Returns: boolean;
      };
      organizacion_autorizada: {
        Args: { p_persona: string; p_finalidad: FinalidadConsentimiento };
        Returns: boolean;
      };
      soy_menor_de_edad: { Args: Record<PropertyKey, never>; Returns: boolean };
      tengo_autorizacion_tutor: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: {
      tipo_institucion: TipoInstitucion;
      tipo_indicador: TipoIndicador;
      unidad_indicador: UnidadIndicador;
      tipo_organizacion: TipoOrganizacion;
      rol_miembro: RolMiembro;
      finalidad_consentimiento: FinalidadConsentimiento;
      tipo_seguimiento: TipoSeguimiento;
    };
    CompositeTypes: { [_ in never]: never };
  };
};

// ---------------------------------------------------------------------------
// Atajos para el resto del código: Fila<'programa'>, NuevaFila<'consentimiento'>
// ---------------------------------------------------------------------------

type Tablas = Database['public']['Tables'];
export type NombreTabla = keyof Tablas;
export type Fila<T extends NombreTabla> = Tablas[T]['Row'];
export type NuevaFila<T extends NombreTabla> = Tablas[T]['Insert'];
export type CambioFila<T extends NombreTabla> = Tablas[T]['Update'];
