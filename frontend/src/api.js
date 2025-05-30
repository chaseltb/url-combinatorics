import axios from 'axios';

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post('/api/upload-image', formData);
  return response.data;
};

export const validateUrl = async (url) => {
  const response = await axios.post('/api/validate-url', { url });
  return response.data;
};
