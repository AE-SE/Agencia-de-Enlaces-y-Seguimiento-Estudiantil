# Propuesta: portal de transparencia de los datos

Estado: propuesta del líder (11-nov-2026), por diseñar. Fuera del alcance del 19 de diciembre de 2026. Registrada en el [ADR 0031](decisiones/0031-producto-y-organizacion.md); vigente con el [ADR 0032](decisiones/0032-agencia-independiente-y-publico-egresado.md), donde es la vitrina de credibilidad de la agencia.

## Qué es
Un sitio público, parecido en espíritu a la transparencia del Estado, que muestra **cómo la agencia procesa los datos oficiales** que usa el sitio para quienes egresan de 4.º medio. Parte del tablero analítico de pronósticos que ya existe (ver manual del tablero (retirado)), rediseñado para que cualquier persona entienda de dónde sale cada cifra.

## Qué no es
- No es una fuente de datos propia: los datos son del Mineduc, el SIES, el DEMRE y otros organismos. La agencia no se los atribuye.
- No es un producto de pago ni un ranking de instituciones.
- No es una promesa de predicción: todo pronóstico es una estimación.

## Qué muestra
1. **Fuentes:** cada archivo oficial usado, con organismo, enlace, fecha de descarga y condiciones de uso.
2. **Proceso:** los pasos entre el archivo original y la cifra que ve el estudiante (limpieza, cruce, normalización), con los casos rechazados y por qué.
3. **Verificación:** cada cifra contrastada con su fuente y la fecha de la última comprobación.
4. **Estimaciones:** los pronósticos de matrícula, siempre rotulados como estimación, con su método, sus supuestos y su margen de error.
5. **Límites:** lo que no se sabe y lo que se retiró por no tener fuente oficial.

## Para qué sirve
- **Confianza:** respaldo público del rigor de la agencia ante quien le encargue un informe o una asesoría (la credibilidad es lo que se vende).
- **Cumplimiento de las reglas del proyecto:** todo dato con fuente, enlace y fecha; solo fuentes oficiales, primarias o académicas.
- **Carta de presentación** para la agencia en 2027, sin competir con el sitio gratuito.

## Condiciones
- Neutralidad: no ordena ni destaca instituciones por ser clientes.
- Sin datos personales de estudiantes.
- Revisar por qué se retiró la página de transparencia anterior (copia en la rama `feat/tablero-pronostico`) antes de reabrir cualquier parte.
- Los pronósticos nunca se presentan como predicción de deserción ni de conducta individual.

## Qué falta
- Diseño de la interfaz con el sistema visual vigente y revisión de accesibilidad.
- Decidir qué indicadores del tablero se muestran y cuáles se retiran.
- Revisión legal del uso de los datos agregados.
- Calendario: se aborda después de la entrega del 19 de diciembre, junto con la constitución de la sociedad por acciones (SpA).
