// --- CONFIGURACIÓN DE CONSTANTES DE PRUEBA ---
export const VALID_USERNAME = 'user@coach.com';
export const VALID_PASSWORD = 'pass';

/**
 * Función que simula la validación de credenciales.
 */
export const mockAuth = (email, password) => {
  if (email === VALID_USERNAME && password === VALID_PASSWORD) {
    return { success: true, message: "Inicio de sesión exitoso." };
  }
  if (email !== VALID_USERNAME) {
    return { success: false, message: "Correo electrónico no registrado." };
  }
  return { success: false, message: "Contraseña incorrecta. Inténtalo de nuevo." };
}