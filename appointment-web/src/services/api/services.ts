import api from '../../utils/api';

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
}

export const getServices = async () => {
  const response = await api.get<{ data: { services: Service[] } }>('/services');
  return response.data.data.services;
};

