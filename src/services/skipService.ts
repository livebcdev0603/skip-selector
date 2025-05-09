import axios from 'axios';
import type { Skip } from '../types/skip';

const API_BASE_URL = 'https://app.wewantwaste.co.uk/api';

export const fetchSkipsByLocation = async (postcode: string, area: string): Promise<Skip[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/skips/by-location`, {
      params: {
        postcode,
        area
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching skips:', error);
    throw error;
  }
}; 