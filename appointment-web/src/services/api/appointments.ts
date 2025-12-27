import api from '../../utils/api';

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  startDateTime: string;
  endDateTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  client?: {
      user: {
          firstName: string;
          lastName: string;
      }
  };
  service?: {
      name: string;
      duration: number;
  };
}

export const getAppointments = async (start?: string, end?: string) => {
  const params = new URLSearchParams();
  if (start) params.append('start', start);
  if (end) params.append('end', end);
  
  const response = await api.get<{ data: { appointments: Appointment[] } }>('/appointments', { params });
  return response.data.data.appointments;
};

export const createAppointment = async (data: { serviceId: string; startDateTime: string; notes?: string }) => {
  const response = await api.post<{ data: { appointment: Appointment } }>('/appointments', data);
  return response.data.data.appointment;
};

export const cancelAppointment = async (id: string, reason: string) => {
    const response = await api.patch<{ data: { appointment: Appointment } }>(`/appointments/${id}/cancel`, { reason });
    return response.data.data.appointment;
}

