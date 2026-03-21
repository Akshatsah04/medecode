import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/report';

export const analyzeReport = async (file, mode = 'Simple', language = 'English') => {
  const formData = new FormData();
  formData.append('report', file);
  formData.append('mode', mode);
  formData.append('language', language);

  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || 'Failed to analyze report.');
    }
    throw new Error('Network error or server is down.');
  }
};

export const getHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch history.');
  }
};
