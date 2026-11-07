/**
 * Crea en Google Forms las dos encuestas del estudio (escolar y adultos), en su
 * versión del 2026-11-06: todas las preguntas tienen respaldo en un instrumento
 * publicado o en una encuesta oficial (ver docs/encuestas/README.md y las fichas
 * metodológicas). Los códigos, textos y opciones son los de encuesta-escolar.md y
 * encuesta-adultos.md: si cambia una pregunta, se cambia en los tres lugares.
 *
 * Cómo usarlo:
 *   1. Entra a https://script.google.com con la cuenta institucional y crea un proyecto nuevo.
 *   2. Borra lo que trae el editor y pega este archivo completo.
 *   3. Elige la función crearEncuestas y presiona Ejecutar. Autoriza los permisos.
 *   4. Abre "Registro de ejecución": ahí aparecen los enlaces de edición y de respuesta.
 *
 * Cada ejecución crea dos formularios nuevos y dos planillas de respuestas.
 * Los enlaces de los formularios en uso no se versionan en el repositorio: si fuera
 * público, cualquiera podría responder y contaminar los datos.
 *
 * Las preguntas marcadas "Solo si…" no son obligatorias: quien no corresponde las deja en blanco.
 */

// ============================================================================
// Textos comunes
// ============================================================================
const REGIONES = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso',
  'Metropolitana de Santiago', "Libertador General Bernardo O'Higgins", 'Maule', 'Ñuble',
  'Biobío', 'La Araucanía', 'Los Ríos', 'Los Lagos',
  'Aysén del General Carlos Ibáñez del Campo', 'Magallanes y de la Antártica Chilena',
];

// Módulo 1 (nivel A): Ramírez Dorantes y Canto (2007), subescala "Información ocupacional",
// ítems 12, 14, 15, 17, 19 y 21, con vocabulario adaptado a Chile.
const ITEMS_M1 = [
  'Encontrar información acerca de las ocupaciones que te interesan',
  'Obtener información acerca de instituciones de educación superior (universidades, institutos profesionales o centros de formación técnica)',
  'Asistir a alguna institución de educación superior a obtener información de las carreras que ofrecen',
  'Asistir a charlas que proporcionen información acerca de las carreras que te interesan',
  'Asistir a algún evento vocacional (feria, expo, etc.)',
  'Preguntarle a algún profesor acerca de las oportunidades de trabajo',
];

// Módulo 2 (nivel C): Fundación Luksic (2025, p. 8), escala de 4 niveles.
const BENEFICIOS = [
  'El Formulario Único de Acreditación Socioeconómica (FUAS)',
  'La gratuidad',
  'Las becas de arancel del Estado',
  'El Crédito con Garantía Estatal (CAE)',
];
const NIVELES_CONOCIMIENTO = ['Muy poco', 'Poco', 'Bien', 'Muy bien'];

// Módulo 3 (nivel C): frases de Fundación Luksic (2025, p. 9) con opción "No sé".
// Claves verificadas el 2026-11-06 (ver las fichas metodológicas). No se muestran al encuestado.
// Clave: 3.1 Verdadero; 3.2 Falso; 3.3 Falso; 3.4 Falso.
const FRASES_VF = [
  'Debo matricularme en instituciones de educación superior acreditadas para poder optar a becas y créditos del Estado.',
  'El ingreso mensual de los egresados de las carreras universitarias siempre es mayor que el de los egresados de carreras de institutos profesionales.',
  'Debo postular a cada beneficio de financiamiento del Estado por separado.',
  'Existe un sistema centralizado para postular a carreras de Institutos Profesionales y Centros de Formación Técnica.',
];

// Módulo 4 (nivel C): preocupaciones, Fundación Luksic (2025, p. 5).
const ITEMS_M4 = [
  'Cumplir con los requisitos académicos para ser admitido',
  'Financiar otros gastos asociados a mis estudios',
  'Financiar el arancel y matrícula',
];
const NIVELES_PREOCUPACION = ['Nada', 'Poco', 'Bastante', 'Mucho'];

// Módulo 5 (nivel A y C): EPEV factor 1 (Peña Téllez et al., 2024, CC BY-NC-SA 4.0)
// y categoría de Luksic (2025, p. 7). El tiempo verbal del molde cambia según la encuesta.
const FUENTES_M5 = [
  'de mis profesores',
  'del orientador/a de mi colegio',
  'de las ferias de orientación',
  'de mi familia',
  'de páginas web o redes sociales oficiales',
];

// Módulo 6 (nivel B): CASEN 2011, pregunta e5. Orden y texto de las categorías.
// La lista escolar omite "Terminó de estudiar" y agrega "No lo sé".
const RAZONES_CASEN_ANTES = [
  'Ayuda en la casa o quehaceres del hogar',
  'Embarazo, maternidad o paternidad',
  'Tengo una discapacidad, requiero establecimiento de educación especial',
  'Una enfermedad que me inhabilita',
  'Problemas familiares',
  'No me interesa',
];
const RAZONES_CASEN_DESPUES = [
  'A mi edad no me sirve estudiar o no conozco la manera para completar mis estudios',
  'Dificultad económica',
  'Trabajo o busco trabajo',
  'Problemas de rendimiento',
  'Expulsión o cancelación de matrícula',
  'No existe establecimiento cercano',
  'Dificultad de acceso o movilización',
  'Otra razón',
];

const LINEAS_DE_AYUDA =
  'Si estás pasando por un momento difícil, no estás solo ni sola. Puedes pedir ayuda gratuita:\n' +
  '• Línea de Prevención del Suicidio: *4141 (Ministerio de Salud, gratuita, las 24 horas, desde celulares).\n' +
  '• Salud Responde: 600 360 7777 (orientación en salud del Ministerio de Salud).\n' +
  '• Si estudias, tu institución suele tener un servicio de apoyo psicológico para estudiantes.';

const PORTAL_BENEFICIOS = 'https://portal.beneficiosestudiantiles.cl/';

// ============================================================================
// Punto de entrada
// ============================================================================
function crearEncuestas() {
  const escolar = crearEncuestaEscolar_();
  const adultos = crearEncuestaAdultos_();
  [['Encuesta escolar', escolar], ['Encuesta adultos', adultos]].forEach(function (par) {
    Logger.log(par[0] + '\n  Editar: ' + par[1].getEditUrl() + '\n  Responder: ' + par[1].getPublishedUrl());
  });
}

// ============================================================================
// Encuesta escolar (3.° y 4.° medio)
// ============================================================================
function crearEncuestaEscolar_() {
  const form = nuevaEncuesta_(
    'Encuesta: decidir qué hacer después del colegio (3.° y 4.° medio)',
    'Esta encuesta es para estudiantes de 3.° y 4.° medio y dura unos 6 minutos. Forma parte de un ' +
    'proyecto de título de Ingeniería en Informática que estudia cómo los jóvenes buscan información para decidir ' +
    'qué hacer después del colegio y cuánto saben sobre los beneficios para estudiar.\n\n' +
    '• Es anónima: no te pedimos nombre, RUT, correo ni teléfono.\n' +
    '• Es voluntaria: puedes saltarte cualquier pregunta o dejarla en cualquier momento, sin consecuencias en tu colegio.\n' +
    '• No hay respuestas buenas ni malas.\n' +
    '• Tus respuestas solo se analizan en conjunto, como porcentajes y promedios del grupo.'
  );

  // Asentimiento: primera pregunta. "No" termina la encuesta.
  const asentimiento = form.addMultipleChoiceItem()
    .setTitle('¿Quieres responder esta encuesta?')
    .setHelpText('Es anónima, voluntaria y puedes dejarla cuando quieras. Solo participan estudiantes cuyo apoderado firmó la autorización.')
    .setRequired(true);
  asentimiento.setChoices([
    asentimiento.createChoice('Sí, quiero participar', FormApp.PageNavigationType.CONTINUE),
    asentimiento.createChoice('No quiero participar', FormApp.PageNavigationType.SUBMIT),
  ]);

  // Módulo 0 (nivel D)
  form.addPageBreakItem().setTitle('Sobre ti').setHelpText('Cuatro preguntas, solo para comparar grupos. No permiten identificarte.');
  opciones_(form, 'E0.1 ¿En qué curso estás?', ['3.° medio', '4.° medio']);
  lista_(form, 'E0.2 ¿En qué región está tu colegio?', REGIONES);
  opciones_(form, 'E0.3 ¿Qué tipo de colegio es?', ['Municipal o Servicio Local de Educación Pública (SLEP)', 'Particular subvencionado', 'Particular pagado', 'Administración delegada', 'No sé']);
  opciones_(form, 'E0.4 ¿Qué modalidad estudias?', ['Científico-humanista', 'Técnico-profesional', 'Artística', 'No sé']);

  // Módulos 1 a 5: núcleo común
  modulo1_(form, 'E');
  modulo2_(form, 'E');
  modulo3_(form, 'E');
  modulo4_(form, 'E', 'Pensando en estudiar después del colegio, ¿qué tanto te preocupa…?');
  modulo5_(form, 'E',
    'Fuentes de información',
    '¿Qué tan de acuerdo estás con cada frase? Marca de 1 (nada de acuerdo) a 5 (muy de acuerdo).',
    'La información que tengo de la carrera que pretendo elegir la obtengo ');

  // Módulo 6 (nivel B): CASEN 2011 e5 en futuro
  form.addPageBreakItem().setTitle('Después de 4.° medio')
    .setHelpText('Una sola pregunta, de respuesta única. Es sobre el futuro: no preguntamos si te pasó. Puedes dejarla en blanco.');
  const razonesEscolar = RAZONES_CASEN_ANTES
    .concat(RAZONES_CASEN_DESPUES)
    .concat(['No lo sé']);
  opciones_(form, 'E6.1 Después de salir de 4.° medio, ¿cuál sería la principal razón por la que podrías no seguir estudiando?', razonesEscolar);

  form.setConfirmationMessage(
    '¡Gracias por responder! Tus respuestas nos ayudan a entender cómo buscan información los jóvenes para decidir qué hacer después del colegio.\n\n' +
    'Si quieres saber más sobre los beneficios para estudiar, la información oficial está en el portal de ' +
    'Beneficios Estudiantiles del Ministerio de Educación: ' + PORTAL_BENEFICIOS + '. También puedes preguntarle al orientador de tu colegio.'
  );
  conectarPlanilla_(form, 'Respuestas: encuesta escolar');
  return form;
}

// ============================================================================
// Encuesta adultos (18 años o más)
// ============================================================================
function crearEncuestaAdultos_() {
  const form = nuevaEncuesta_(
    'Encuesta: qué pasa después del colegio (18 años o más)',
    'Esta encuesta es para personas de 18 años o más que ya salieron del colegio, estén estudiando o no. ' +
    'Dura unos 7 minutos y forma parte de un proyecto de título de Ingeniería en Informática sobre cómo ' +
    'las personas buscan información para decidir qué hacer después del colegio, cuánto saben de los beneficios para estudiar y qué les pasó después.\n\n' +
    '• Es anónima: no te pedimos nombre, RUT, correo ni teléfono.\n' +
    '• Es voluntaria: puedes saltarte cualquier pregunta o dejarla en cualquier momento.\n' +
    '• No hay respuestas buenas ni malas.\n' +
    '• Tus respuestas solo se analizan en conjunto, como porcentajes y promedios del grupo.\n\n' +
    'Algunas preguntas dicen "Solo si…": si no te corresponden, déjalas en blanco.'
  );

  const consentimiento = form.addMultipleChoiceItem()
    .setTitle('Consentimiento')
    .setHelpText('Confirmo que tengo 18 años o más, que leí la presentación y que acepto responder esta encuesta anónima. Sé que puedo dejarla en cualquier momento.')
    .setRequired(true);
  consentimiento.setChoices([
    consentimiento.createChoice('Acepto participar', FormApp.PageNavigationType.CONTINUE),
    consentimiento.createChoice('No acepto', FormApp.PageNavigationType.SUBMIT),
    consentimiento.createChoice('Tengo menos de 18 años', FormApp.PageNavigationType.SUBMIT),
  ]);

  // Módulo 0 (nivel D y B)
  form.addPageBreakItem().setTitle('Sobre ti y tu situación actual')
    .setHelpText('La edad se pide en tramos: basta para comparar y no permite identificarte.');
  opciones_(form, 'A0.1 ¿Qué edad tienes?', ['18-20', '21-24', '25-29', '30 o más']);
  lista_(form, 'A0.2 ¿En qué región vives?', REGIONES);
  opciones_(form, 'A0.3 ¿En qué tipo de colegio terminaste la enseñanza media?', ['Municipal o SLEP', 'Particular subvencionado', 'Particular pagado', 'Administración delegada', 'Exámenes libres o educación de adultos', 'No sé']);
  opciones_(form, 'A0.4 ¿Cuál es tu situación hoy?', [
    'Estoy estudiando en la educación superior',
    'Entré a estudiar pero dejé de hacerlo',
    'Nunca entré a la educación superior',
    'Ya terminé una carrera',
  ]).setRequired(true);
  opciones_(form, 'A0.5 La semana pasada, ¿trabajaste al menos una hora, sin considerar los quehaceres del hogar?', ['Sí', 'No']);
  opciones_(form, 'A0.6 Solo si estudias o estudiaste: ¿en qué tipo de institución?', ['Universidad', 'Instituto profesional', 'Centro de formación técnica']);

  // Módulos 1 a 3: idénticos a la versión escolar
  modulo1_(form, 'A');
  modulo2_(form, 'A');
  modulo3_(form, 'A');
  // Módulos 4 y 5: en pasado
  modulo4_(form, 'A', 'Cuando estabas en 4.° medio y pensabas en estudiar después del colegio, ¿qué tanto te preocupaba…?');
  modulo5_(form, 'A',
    'Fuentes de información en 4.° medio',
    'Piensa en cuando estabas en 4.° medio. ¿Qué tan de acuerdo estás con cada frase? Marca de 1 (nada de acuerdo) a 5 (muy de acuerdo).',
    'La información que tenía de la carrera que pretendía elegir la obtenía ');

  // Módulo 6 (nivel B): CASEN 2011 e5, categorías sin cambio
  form.addPageBreakItem().setTitle('Por qué no estudias hoy')
    .setHelpText('Solo si dejaste de estudiar o nunca entraste a la educación superior. Si no te corresponde, déjala en blanco.');
  const razonesAdulto = RAZONES_CASEN_ANTES
    .concat(['Terminé de estudiar'])
    .concat(RAZONES_CASEN_DESPUES);
  opciones_(form, 'A6.1 ¿Cuál es la principal razón por la cual no asistes actualmente a algún establecimiento educacional?', razonesAdulto);

  // Módulo 7 (nivel B): CASEN 2022 e13b y e18; gratuidad con el nombre del portal
  form.addPageBreakItem().setTitle('Beneficios que recibiste')
    .setHelpText('Solo si alguna vez entraste a la educación superior. Si no te corresponde, déjalas en blanco.');
  opciones_(form, 'A7.1 ¿Has recibido o recibes alguna beca para pagar tus estudios de educación superior?', ['Sí', 'No', 'No sé']);
  opciones_(form, 'A7.2 ¿Has recibido o recibes algún crédito para pagar la carrera que estudias o estudiaste?', ['Sí', 'No', 'No sé']);
  opciones_(form, 'A7.3 ¿Has recibido o recibes la Gratuidad para pagar tu carrera?', ['Sí', 'No', 'No sé']);

  // Módulo 8 (nivel A): MSPSS, subescala "otros significativos" (López-Angulo et al., 2021)
  form.addPageBreakItem().setTitle('Apoyo que sientes')
    .setHelpText('Solo si hoy estudias en la educación superior. Marca de 1 (muy en desacuerdo) a 7 (muy de acuerdo).');
  escala_(form, 'A8.1 Cuando necesito ayuda, sé que hay alguien que me puede apoyar', 1, 7, 'Muy en desacuerdo', 'Muy de acuerdo');
  escala_(form, 'A8.2 Hay una persona que me ofrece consuelo cuando lo necesito', 1, 7, 'Muy en desacuerdo', 'Muy de acuerdo');
  escala_(form, 'A8.3 Hay una persona que se interesa por lo que yo siento', 1, 7, 'Muy en desacuerdo', 'Muy de acuerdo');
  escala_(form, 'A8.4 Cuando tengo dificultades tengo a alguien que me apoya', 1, 7, 'Muy en desacuerdo', 'Muy de acuerdo');

  // Módulo 9 (nivel A): ESPU, factor "Integración social" (Alonso García y González Ortiz de Zárate, 2024)
  form.addPageBreakItem().setTitle('Cómo te sientes en tu institución')
    .setHelpText('Solo si hoy estudias en la educación superior. Marca de 1 (nada de acuerdo) a 7 (totalmente de acuerdo).');
  escala_(form, 'A9.1 Me siento integrado dentro de clase', 1, 7, 'Nada de acuerdo', 'Totalmente de acuerdo');
  escala_(form, 'A9.2 Tengo afecto por mis compañeros', 1, 7, 'Nada de acuerdo', 'Totalmente de acuerdo');
  escala_(form, 'A9.3 En mi institución me siento aceptado por los demás', 1, 7, 'Nada de acuerdo', 'Totalmente de acuerdo');

  // Las líneas de ayuda las ve todo el mundo al terminar.
  form.setConfirmationMessage(
    '¡Gracias por responder! Tu experiencia nos ayuda a entender qué pasa con las personas después del colegio.\n\n' +
    LINEAS_DE_AYUDA + '\n\n' +
    'Información oficial sobre beneficios para estudiar: portal de Beneficios Estudiantiles del Ministerio de Educación, ' + PORTAL_BENEFICIOS
  );
  conectarPlanilla_(form, 'Respuestas: encuesta adultos');
  return form;
}

// ============================================================================
// Módulos compartidos (núcleo común). El prefijo es 'E' (escolar) o 'A' (adultos).
// ============================================================================

// Módulo 1: confianza para obtener información (escala 0 a 9), idéntico en las dos encuestas.
function modulo1_(form, prefijo) {
  form.addPageBreakItem().setTitle('Confianza para obtener información de carreras')
    .setHelpText('¿Cuánta confianza tienes de que podrías…? Marca de 0 (ninguna confianza) a 9 (confianza absoluta).');
  ITEMS_M1.forEach(function (texto, i) {
    escala_(form, prefijo + '1.' + (i + 1) + ' ' + texto, 0, 9, 'Ninguna confianza', 'Confianza absoluta');
  });
}

// Módulo 2: conocimiento percibido (4 niveles), idéntico en las dos encuestas.
function modulo2_(form, prefijo) {
  form.addPageBreakItem().setTitle('Cuánto crees conocer');
  const grilla = form.addGridItem()
    .setTitle(prefijo + '2.1 a ' + prefijo + '2.4 ¿Qué tan bien crees que conoces…?')
    .setRows(BENEFICIOS)
    .setColumns(NIVELES_CONOCIMIENTO);
  return grilla;
}

// Módulo 3: verdadero, falso o no sé, idéntico en las dos encuestas.
function modulo3_(form, prefijo) {
  form.addPageBreakItem().setTitle('Verdadero o falso')
    .setHelpText('Marca si cada frase es verdadera o falsa. Si no sabes, marca "No sé": es mejor que adivinar.');
  FRASES_VF.forEach(function (frase, i) {
    opciones_(form, prefijo + '3.' + (i + 1) + ' ' + frase, ['Verdadero', 'Falso', 'No sé']);
  });
}

// Módulo 4: preocupaciones (4 niveles). La instrucción cambia de tiempo en la versión de adultos.
function modulo4_(form, prefijo, instruccion) {
  form.addPageBreakItem().setTitle('Qué te preocupa');
  form.addGridItem()
    .setTitle(prefijo + '4.1 a ' + prefijo + '4.3 ' + instruccion)
    .setRows(ITEMS_M4)
    .setColumns(NIVELES_PREOCUPACION);
}

// Módulo 5: fuentes de información (EPEV, 5 puntos). La redacción cambia de tiempo en adultos.
function modulo5_(form, prefijo, titulo, instruccion, molde) {
  form.addPageBreakItem().setTitle(titulo).setHelpText(instruccion);
  FUENTES_M5.forEach(function (fuente, i) {
    form.addScaleItem()
      .setTitle(prefijo + '5.' + (i + 1) + ' ' + molde + fuente)
      .setBounds(1, 5)
      .setLabels('Nada de acuerdo', 'Muy de acuerdo');
  });
}

// ============================================================================
// Ayudas
// ============================================================================
function nuevaEncuesta_(titulo, descripcion) {
  const form = FormApp.create(titulo);
  form.setDescription(descripcion)
    .setCollectEmail(false)              // no se recopilan correos
    .setLimitOneResponsePerUser(false)   // limitar exige iniciar sesión: rompe el anonimato
    .setAllowResponseEdits(false)
    .setShowLinkToRespondAgain(false)
    .setPublishingSummary(false)         // nadie ve el resumen de respuestas de otros
    .setProgressBar(true);
  // En cuentas institucionales, por defecto solo responde gente del mismo dominio.
  try {
    form.setRequireLogin(false);
  } catch (e) {
    Logger.log('No se pudo quitar la restricción de dominio: ' + e + '. Desactívala a mano en Configuración → Respuestas.');
  }
  return form;
}

function opciones_(form, titulo, valores) {
  return form.addMultipleChoiceItem().setTitle(titulo).setChoiceValues(valores);
}

function lista_(form, titulo, valores) {
  return form.addListItem().setTitle(titulo).setChoiceValues(valores);
}

function escala_(form, titulo, minimo, maximo, etiquetaMinima, etiquetaMaxima) {
  return form.addScaleItem()
    .setTitle(titulo)
    .setBounds(minimo, maximo)
    .setLabels(etiquetaMinima, etiquetaMaxima);
}

function conectarPlanilla_(form, nombre) {
  const planilla = SpreadsheetApp.create(nombre);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, planilla.getId());
}
