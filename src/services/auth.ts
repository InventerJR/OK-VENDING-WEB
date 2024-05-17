import { API_URLS } from '../lib/config';

interface LoginInput {
  email: string;
  password: string;
}

const loginUser = async (loginInput: LoginInput): Promise<any> => {
  const response = await fetch(API_URLS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginInput),
  });

  // Comprueba el estado de la respuesta
  if (!response.ok) {
    // Convierte la respuesta a JSON
    const errorData = await response.json();
    // Lanza un error con el mensaje del backend
    throw new Error(errorData.Error || 'Error en el inicio de sesión');
  }

  return response.json();
};

export { loginUser };