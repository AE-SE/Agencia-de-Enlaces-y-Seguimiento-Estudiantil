// Registro de alertas de crisis en la base de datos (ADR 0019).
//
// Solo el servidor escribe alertas, con la clave de servicio. Esta función
// habla con la API de Supabase por fetch, sin librerías nuevas (AGENTS.md 2.3).
//
// La alerta que llega aquí no trae el mensaje (ver AlertaDeCrisis en crisis.ts),
// y este adaptador solo envía los campos de la tabla alerta_crisis. Así, aunque
// alguien cambie el tipo más adelante, el texto de la persona no sale de aquí.
//
// Los errores no incluyen el cuerpo de la respuesta ni la alerta: podrían
// contener datos sensibles y terminar en logs.

import type { AlertaDeCrisis, RegistrarAlerta } from './crisis.ts';

export type ConfiguracionRegistro = {
  urlSupabase: string;          // p. ej. https://<proyecto>.supabase.co (variable de entorno)
  claveServicio: string;        // SUPABASE_SERVICE_ROLE_KEY (variable de entorno, nunca en el repo)
  fetchFn?: typeof fetch;       // inyectable para pruebas
};

export function crearRegistrarAlerta(config: ConfiguracionRegistro): RegistrarAlerta {
  const fetchFn = config.fetchFn ?? fetch;
  const url = `${config.urlSupabase.replace(/\/+$/, '')}/rest/v1/alerta_crisis`;

  return async (alerta: AlertaDeCrisis): Promise<void> => {
    const cuerpo = {
      senales: alerta.senales,
      detectada_el: alerta.detectadaEl,
    };

    const respuesta = await fetchFn(url, {
      method: 'POST',
      headers: {
        apikey: config.claveServicio,
        Authorization: `Bearer ${config.claveServicio}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(cuerpo),
    });

    if (!respuesta.ok) {
      // Sin cuerpo ni estado detallado: solo el código, para diagnosticar sin datos.
      throw new Error(`No se pudo registrar la alerta (HTTP ${respuesta.status})`);
    }
  };
}
