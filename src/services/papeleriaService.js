// src/services/papeleriaService.js
import api from './api';

const getAll = async (params = {}) => {
  const response = await api.get('/papeleria', { params });
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/papeleria/${id}`);
  return response.data;
};

const create = async (data) => {

  const isFormData = data instanceof FormData;
  
  const config = isFormData ? {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  } : {};
  
  const response = await api.post('/papeleria', data, config);
  return response.data;
};

const update = async (id, data) => {
  try {
    // Asegúrate de que el id es válido y los datos son correctos
    console.log(`Actualizando producto ${id} con datos:`, data);
    const response = await api.put(`/papeleria/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error en la actualización:', error.response?.data || error);
    throw error;
  }
}

const remove = async (id) => {
  const response = await api.delete(`/papeleria/${id}`);
  return response.data;
};

// Funciones adicionales que podrían ser útiles
const getByCategory = async (category) => {
  const response = await api.get(`/papeleria/categoria/${category}`);
  return response.data;
};

const searchProducts = async (query) => {
  const response = await api.get(`/papeleria/search`, { params: { q: query } });
  return response.data;
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  getByCategory,
  searchProducts
};