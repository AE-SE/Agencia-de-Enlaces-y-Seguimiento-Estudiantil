/**
 * Crea en Google Forms la encuesta del estudio, versión del 2026-11-13: se aplica en línea
 * a personas de 18 años o más que egresaron de 4.º medio en los últimos cinco años.
 * Es un solo instrumento estandarizado, completo: la Escala de Autoeficacia para la
 * Elección de Carrera (EAEC) de Ramírez Dorantes y Canto (2007), con 55 ítems de 0 a 9
 * y vocabulario adaptado a Chile (ver docs/encuestas/ficha-metodologica.md).
 * Los textos son los de encuesta-egresados.md: si cambia un ítem, se cambia en los tres lugares.
 *
 * Cómo usarlo:
 *   1. Entra a https://script.google.com con la cuenta institucional y crea un proyecto nuevo.
 *   2. Borra lo que trae el editor y pega este archivo completo.
 *   3. Elige la función crearEncuestas y presiona Ejecutar. Autoriza los permisos.
 *   4. Abre "Registro de ejecución": ahí aparecen los enlaces de edición y de respuesta.
 *
 * Cada ejecución crea un formulario nuevo y su planilla de respuestas.
 * Los enlaces de los formularios en uso no se versionan en el repositorio: si fuera
 * público, cualquiera podría responder y contaminar los datos.
 */

const REGIONES = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso',
  'Metropolitana de Santiago', "Libertador General Bernardo O'Higgins", 'Maule', 'Ñuble',
  'Biobío', 'La Araucanía', 'Los Ríos', 'Los Lagos',
  'Aysén del General Carlos Ibáñez del Campo', 'Magallanes y de la Antártica Chilena',
];

// EAEC, Anexo 1 (pp. 52-54), en el orden original. Las páginas siguen las cinco
// subescalas de la Tabla 1 (p. 47), pero sin nombrarlas, para no orientar las respuestas.
const PARTES_EAEC = [
  [ // ítems 1 a 11
    'Evaluar con exactitud tus habilidades',
    'Determinar cuál sería tu trabajo ideal',
    'Determinar cuáles son tus valores',
    'Definir el estilo de vida que te gustaría tener',
    'Estimar lo que quieres ganar al desempeñar tu profesión',
    'Identificar las actividades que menos te gustan',
    'Identificar algunas características de tu personalidad',
    'Aceptar dejar algo importante para ti, a fin de alcanzar tus metas profesionales',
    'Identificar algunas carreras que te interesan',
    'Identificar algunas ocupaciones que te interesan',
    'Determinar si tienes preferencia por el trabajo con la gente o con información',
  ],
  [ // ítems 12 a 21
    'Encontrar información acerca de las ocupaciones que te interesan',
    'Hablar con una persona que esté trabajando en la ocupación que te interesa',
    'Obtener información acerca de instituciones de educación superior (universidades, institutos profesionales o centros de formación técnica)',
    'Asistir a alguna institución de educación superior a obtener información de las carreras que ofrecen',
    'Obtener información impresa de alguna de las instituciones de educación superior de tu región o del país',
    'Asistir a charlas que proporcionen información acerca de las carreras que te interesan',
    'Revisar libros relacionados con las carreras que te interesan',
    'Asistir a algún evento vocacional (feria, expo, etc.)',
    'Describir las características de las carreras que te interesan',
    'Preguntarle a algún profesor acerca de las oportunidades de trabajo',
  ],
  [ // ítems 22 a 34
    'Seleccionar una carrera entre varias en las que estás interesado o interesada',
    'Escoger una carrera que se adapte al estilo de vida de tu preferencia',
    'Seleccionar una ocupación de una lista que te interese',
    'Escoger una carrera que vaya de acuerdo con tus intereses',
    'Persistir en lo que te has propuesto hasta alcanzar tus metas profesionales',
    'Determinar el nivel académico que te gustaría obtener',
    'Encontrar la manera de obtener lo que quieres aunque tus circunstancias te sean desfavorables',
    'Definir lo que estarás haciendo dentro de cinco años',
    'Escoger una carrera que tus padres no aprueban',
    'Elegir una carrera en la que la mayoría de los trabajadores son del sexo opuesto',
    'Elegir una carrera que esté de acuerdo con tus habilidades',
    'Elegir la mejor carrera para ti, a pesar de que te lleve más tiempo terminarla',
    'Describir el ambiente laboral en el que te gustaría trabajar',
  ],
  [ // ítems 35 a 46
    'Determinar los pasos a seguir si tuvieras problemas en la carrera que elegiste',
    'Cambiar de carrera si no te gusta la primera que elegiste',
    'Cambiar de empleo si no estás satisfecho o satisfecha',
    'Encontrar alternativas de carrera si no pudieras ingresar a la que elegiste primero',
    'Encontrar alternativas de solución si te encontraras en una situación difícil',
    'Resolver algún problema académico',
    'Permanecer tranquilo o tranquila cuando te encuentras en dificultades en el colegio',
    'Manejar adecuadamente acontecimientos inesperados',
    'Volver a estudiar después de algunos años de haberlo dejado',
    'Tener una estrategia en caso de que te cancelaran la matrícula en el colegio',
    'Volver a postular a una institución de educación superior después de no quedar seleccionado o seleccionada la primera vez',
    'Resistir las presiones de tus padres y amigos para elegir una carrera que no te gusta',
  ],
  [ // ítems 47 a 55
    'Hacer un plan de tus metas vocacionales para los próximos cinco años',
    'Determinar los pasos que necesitas realizar para terminar con éxito la carrera que elijas',
    'Planear tus actividades del semestre, del mes o del día',
    'Utilizar una agenda o libreta para no olvidar tus compromisos escolares',
    'Establecer una fecha para realizar algún plan personal',
    'Tomar cursos extracurriculares que te servirán en tu carrera',
    'Relacionarte con personas ligadas a la carrera que deseas estudiar',
    'Jerarquizar tus actividades en orden de importancia de acuerdo a tus planes académicos',
    'Hablar con alguien de tus planes vocacionales futuros',
  ],
];

const INSTRUCCION_EAEC =
  '¿Cuánta confianza tienes de que podrías…? Marca de 0 a 9: 0 = ninguna confianza; ' +
  '1 a 3 = muy poca; 4 y 5 = algo de confianza; 6 y 7 = mucha; 8 y 9 = confianza absoluta.';

function crearEncuestas() {
  const form = nuevaEncuesta_(
    'Encuesta: confianza para elegir una carrera (personas que egresaron de 4.º medio)',
    'Esta encuesta es para personas de 18 años o más que egresaron de 4.º medio en los últimos cinco años, ' +
    'hayan entrado o no a la educación superior. Dura entre 10 y 15 minutos. Forma parte de un proyecto de título ' +
    'de Ingeniería en Informática que estudia cuánta confianza tienen las personas que egresan para hacer ' +
    'las tareas necesarias para elegir una carrera.\n\n' +
    '• Es anónima: no te pedimos nombre, RUT, correo, edad exacta ni teléfono, y no guardamos tu dirección IP.\n' +
    '• Es voluntaria: puedes saltarte cualquier pregunta o dejarla en cualquier momento, sin ninguna consecuencia.\n' +
    '• No hay respuestas correctas ni incorrectas: responde con toda honestidad.\n' +
    '• No preguntamos por tu salud ni por tu situación económica.\n' +
    '• Tus respuestas solo se analizan en conjunto, como promedios de grupos de al menos cinco respuestas. Nadie verá tus respuestas individuales.'
  );

  // Filtro de edad: primera pregunta. "No" termina el formulario.
  const edad = form.addMultipleChoiceItem()
    .setTitle('¿Tienes 18 años o más?')
    .setHelpText('Esta encuesta es solo para personas de 18 años o más.')
    .setRequired(true);
  edad.setChoices([
    edad.createChoice('Sí', FormApp.PageNavigationType.CONTINUE),
    edad.createChoice('No', FormApp.PageNavigationType.SUBMIT),
  ]);

  // Consentimiento informado: "No acepto" termina el formulario.
  form.addPageBreakItem().setTitle('Consentimiento informado')
    .setHelpText('Leíste arriba para qué es esta encuesta y cómo se usan tus respuestas. Si aceptas, puedes dejarla en cualquier momento.');
  const acepta = form.addMultipleChoiceItem()
    .setTitle('¿Aceptas participar en esta encuesta, con las condiciones que acabas de leer?')
    .setRequired(true);
  acepta.setChoices([
    acepta.createChoice('Sí, acepto participar', FormApp.PageNavigationType.CONTINUE),
    acepta.createChoice('No acepto', FormApp.PageNavigationType.SUBMIT),
  ]);

  form.addPageBreakItem().setTitle('Sobre ti').setHelpText('Cuatro preguntas, solo para comparar grupos. No permiten identificarte.');
  opciones_(form, 'C1 ¿En qué año egresaste de 4.º medio?', ['2021', '2022', '2023', '2024', '2025', 'Otro año']);
  lista_(form, 'C2 ¿En qué región vives?', REGIONES);
  opciones_(form, 'C3 ¿Cuál es tu situación actual?', ['Estudio en la educación superior', 'Trabajo', 'Estudio y trabajo', 'Ni estudio ni trabajo']);
  opciones_(form, 'C4 Después de egresar de 4.º medio, ¿alguna institución te dio orientación para elegir qué hacer (por ejemplo, un establecimiento, una institución de educación superior u otra organización)?', ['Sí', 'No']);

  let numero = 1;
  PARTES_EAEC.forEach(function (items, i) {
    form.addPageBreakItem().setTitle('Parte ' + (i + 1) + ' de ' + PARTES_EAEC.length).setHelpText(INSTRUCCION_EAEC);
    items.forEach(function (texto) {
      escala_(form, numero + '. ' + texto, 0, 9, 'Ninguna confianza', 'Confianza absoluta');
      numero++;
    });
  });

  form.setConfirmationMessage(
    '¡Gracias por responder! Tus respuestas nos ayudan a entender cómo se sienten las personas que egresan frente a la elección de una carrera.\n\n' +
    'Información oficial sobre carreras y beneficios para estudiar: https://acceso.mineduc.cl/ y ' +
    'https://portal.beneficiosestudiantiles.cl/ (Ministerio de Educación).'
  );
  conectarPlanilla_(form, 'Respuestas: encuesta a personas egresadas EAEC');
  Logger.log('Encuesta a personas egresadas\n  Editar: ' + form.getEditUrl() + '\n  Responder: ' + form.getPublishedUrl());
}

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
