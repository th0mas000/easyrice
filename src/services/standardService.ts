import axios from 'axios';
import type { Standard } from '../types';


export const standardService = {
  async getStandards(): Promise<Standard[]> {
    try {

      const response = await axios.get('/standards.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching standards:', error);
      throw new Error('Failed to fetch standards');
    }
  }
};
