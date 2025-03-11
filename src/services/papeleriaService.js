// src/services/papeleriaService.js
import api from './api';

const getAll = async () => {
  const response = await api.get('/papeleria');
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/papeleria/${id}`);
  return response.data;
};

const create = async (data) => {
  const response = await api.post('/papeleria', data);
  return response.data;
};

const update = async (id, data) => {
  const response = await api.put(`/papeleria/${id}`, data);
  return response.data;
};

const remove = async (id) => {
  const response = await api.delete(`/papeleria/${id}`);
  return response.data;
};

export default {
  getAll,
  getById,
  create,
  update,
  remove
};