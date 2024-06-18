// api.js

import axios from 'axios';

const API_URL = 'http://your-django-server.com/api'; // Cambia esto a la URL correcta de tu API

// Función para iniciar sesión
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, { email, password });
    return response.data;  // Devuelve los datos de la respuesta
  } catch (error) {
    throw error.response.data;  // Lanza el error para ser manejado por el componente que lo llama
  }
};

// Puedes agregar más funciones para otras llamadas a la API aquí
