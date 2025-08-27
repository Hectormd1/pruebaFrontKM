// Función para convertir nombres de productos en slugs URL-friendly
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
    .replace(/[\s_-]+/g, '-') // Reemplazar espacios y guiones por un solo guión
    .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y final
};

// Función para convertir slug de vuelta a texto legible (capitalizado)
export const unslugify = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
