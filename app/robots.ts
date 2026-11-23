import type { MetadataRoute } from 'next';

// Las páginas leen la base en cada visita, y el plan gratuito de Supabase ya pasó su cuota de tráfico de salida.
// Se deja indexar el sitio (fichas incluidas: la gente las busca), pero no las direcciones con parámetros, que
// son combinaciones sin fin de búsquedas, filtros, páginas y comparaciones, ni la API.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/*?'] },
  };
}
