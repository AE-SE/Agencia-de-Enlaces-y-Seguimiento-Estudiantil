/**
 * Crea en Google Forms las dos encuestas del estudio (escolar y adultos), en su
 * versión del 2026-11-04: consentimiento, caracterización y beneficios, sin
 * escalas psicométricas validadas (ver docs/encuestas/README.md).
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

const BENEFICIOS = [
  'Formulario Único de Acreditación Socioeconómica (FUAS)',
  'Gratuidad',
  'Becas de arancel del Estado',
  'Crédito con Garantía Estatal (CAE)',
];
const NIVELES_CONOCIMIENTO = ['1. No lo conozco', '2. Lo he escuchado', '3. Sé qué es', '4. Sé cómo postular'];

// Claves verificadas el 2026-11-04 (ver las fichas metodológicas). No se muestran al encuestado.
const FRASES_VF = [
  'Para acceder a la gratuidad hay que completar el FUAS.',
  'La gratuidad se puede usar en cualquier universidad, instituto o centro de formación técnica.',
  'Para postular a beneficios hay que tener primero el puntaje de la prueba de acceso (PAES).',
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
    'Esta encuesta es para estudiantes de 3.° y 4.° medio y dura unos 5 minutos. Forma parte de un ' +
    'proyecto de título de Ingeniería en Informática que estudia cómo los jóvenes deciden qué hacer después ' +
    'del colegio y cuánto saben sobre los beneficios para estudiar.\n\n' +
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

  // Módulo 0
  form.addPageBreakItem().setTitle('Sobre ti').setHelpText('Cuatro preguntas, solo para comparar grupos. No permiten identificarte.');
  opciones_(form, 'E0.1 ¿En qué curso estás?', ['3.° medio', '4.° medio']);
  lista_(form, 'E0.2 ¿En qué región está tu colegio?', REGIONES);
  opciones_(form, 'E0.3 ¿Qué tipo de colegio es?', ['Municipal o Servicio Local de Educación Pública (SLEP)', 'Particular subvencionado', 'Particular pagado', 'Administración delegada', 'No sé']);
  opciones_(form, 'E0.4 ¿Qué modalidad estudias?', ['Científico-humanista', 'Técnico-profesional', 'Artística', 'No sé']);

  // Módulo 2 (núcleo común). El código E2 se mantiene: el módulo 1 se eliminó el 2026-11-04.
  form.addPageBreakItem().setTitle('Beneficios para estudiar');
  modulo2Comun_(form, 'E');
  opciones_(form, 'E2.8 ¿Piensas postular al FUAS?', ['Sí', 'No', 'Todavía no lo sé', 'No sé qué es el FUAS']);
  opciones_(form, 'E2.9 ¿Sabes en qué fechas se postula al FUAS?', ['Sí, conozco las fechas', 'Más o menos', 'No']);
  casillas_(form, 'E2.10 Si no piensas postular o aún no lo sabes, ¿por qué? (puedes marcar varias)',
    ['Creo que no me corresponde', 'No sé cómo hacerlo', 'Me parece difícil o largo', 'No sé si voy a estudiar', 'No me interesa estudiar', 'Otra razón']);
  casillas_(form, 'E2.11 ¿Dónde te has informado sobre qué estudiar y cómo financiarlo? (puedes marcar varias)', FUENTES_INFORMACION_());

  form.setConfirmationMessage(
    '¡Gracias por responder! Tus respuestas nos ayudan a entender cómo deciden los jóvenes qué hacer después del colegio.\n\n' +
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
    'Dura unos 6 minutos y forma parte de un proyecto de título de Ingeniería en Informática sobre cómo ' +
    'las personas deciden qué hacer después del colegio, cuánto saben de los beneficios para estudiar y qué pasó con su postulación.\n\n' +
    '• Es anónima: no te pedimos nombre, RUT, correo ni teléfono.\n' +
    '• Es voluntaria: puedes saltarte cualquier pregunta o dejarla en cualquier momento.\n' +
    '• No hay respuestas buenas ni malas.\n' +
    '• Tus respuestas solo se analizan en conjunto, como porcentajes y promedios del grupo.'
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

  // Módulo 0. A0.7 se eliminó el 2026-11-04 junto con el módulo 3.
  form.addPageBreakItem().setTitle('Sobre ti y tu situación actual')
    .setHelpText('La edad se pide en tramos: basta para comparar y no permite identificarte.');
  opciones_(form, 'A0.1 ¿Qué edad tienes?', ['18-20', '21-24', '25-29', '30 o más']);
  lista_(form, 'A0.2 ¿En qué región vives?', REGIONES);
  opciones_(form, 'A0.3 ¿En qué tipo de colegio terminaste la enseñanza media?', ['Municipal o SLEP', 'Particular subvencionado', 'Particular pagado', 'Administración delegada', 'Exámenes libres o educación de adultos', 'No sé']);
  opciones_(form, 'A0.5 Además, ¿trabajas?', ['Sí, jornada completa', 'Sí, jornada parcial', 'No']);
  opciones_(form, 'A0.6 Solo si estudias o estudiaste: ¿en qué tipo de institución?', ['Universidad', 'Instituto profesional', 'Centro de formación técnica']);
  opciones_(form, 'A0.4 ¿Cuál es tu situación hoy?', [
    'Estoy estudiando en la educación superior',
    'Entré a estudiar pero dejé de hacerlo',
    'Nunca entré a la educación superior',
    'Ya terminé una carrera',
  ]).setRequired(true);

  // Módulo 2 (núcleo común + propio)
  form.addPageBreakItem().setTitle('Beneficios para estudiar');
  modulo2Comun_(form, 'A');
  opciones_(form, 'A2.8 ¿Postulaste alguna vez al FUAS?', ['Sí', 'No', 'No recuerdo', 'No sé qué es el FUAS']);
  casillas_(form, 'A2.9 Si postulaste, ¿qué obtuviste? (puedes marcar varias)', ['Gratuidad', 'Una beca de arancel', 'Un crédito (CAE o Fondo Solidario)', 'Nada', 'No recuerdo']);
  casillas_(form, 'A2.10 Si no postulaste, ¿por qué? (puedes marcar varias)', ['Creía que no me correspondía', 'No sabía cómo hacerlo', 'No supe las fechas o se me pasó el plazo', 'Me pareció difícil o largo', 'No pensaba estudiar', 'Otra razón']);
  opciones_(form, 'A2.11 Solo si dejaste de estudiar o nunca entraste: ¿influyó el dinero?', ['Sí, fue la razón principal', 'Sí, en parte', 'No']);
  opciones_(form, 'A2.12 Solo si estudias o estudiaste: ¿perdiste algún beneficio después de obtenerlo?', ['Sí', 'No', 'No tuve beneficios']);
  casillas_(form, 'A2.13 Cuando estabas en 4.° medio, ¿dónde te informaste sobre qué estudiar y cómo financiarlo? (puedes marcar varias)', FUENTES_INFORMACION_('En ningún lugar'));

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
// Bloques compartidos
// ============================================================================

// Partes 2A y 2B: idénticas en las dos encuestas (núcleo común).
function modulo2Comun_(form, prefijo) {
  form.addGridItem()
    .setTitle(prefijo + '2.1 a ' + prefijo + '2.4 ¿Qué tanto conoces cada uno de estos beneficios?')
    .setRows(BENEFICIOS)
    .setColumns(NIVELES_CONOCIMIENTO);
  form.addSectionHeaderItem().setTitle('Verdadero o falso')
    .setHelpText('Marca si cada frase es verdadera o falsa. Si no sabes, marca "No sé": es mejor que adivinar.');
  FRASES_VF.forEach(function (frase, i) {
    opciones_(form, prefijo + '2.' + (5 + i) + ' ' + frase, ['Verdadero', 'Falso', 'No sé']);
  });
}

// La última opción cambia de tiempo: el escolar todavía está decidiendo; el adulto recuerda.
function FUENTES_INFORMACION_(ultima) {
  return ['Orientador o profesor del colegio', 'Familia', 'Amigos', 'Páginas oficiales del Ministerio de Educación',
    'Redes sociales', 'Ferias o visitas de instituciones', ultima || 'En ningún lugar todavía'];
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

function casillas_(form, titulo, valores) {
  return form.addCheckboxItem().setTitle(titulo).setChoiceValues(valores);
}

function lista_(form, titulo, valores) {
  return form.addListItem().setTitle(titulo).setChoiceValues(valores);
}

function conectarPlanilla_(form, nombre) {
  const planilla = SpreadsheetApp.create(nombre);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, planilla.getId());
}
