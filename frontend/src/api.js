import axios from 'axios';

const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api' });

export const getBooks = (params={}) => api.get('/books/', {params});
export const getBook = (id) => api.get(`/books/${id}/`);
export const issueBook = (id) => api.post(`/books/${id}/issue/`);
export const returnBook = (id) => api.post(`/books/${id}/return/`);
export const getMembers = () => api.get('/members/');
export const createMember = (data) => api.post('/members/create/', data);
export const getActivity = () => api.get('/activity/');
export const getStats = () => api.get('/stats/');
export const getNotifications = () => api.get('/notifications/');
