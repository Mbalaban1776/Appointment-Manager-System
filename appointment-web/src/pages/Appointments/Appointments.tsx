import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppointments, createAppointment } from '../../services/api/appointments';
import { getServices } from '../../services/api/services';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Typography,
  Paper
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Appointments: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedService, setSelectedService] = useState('');
  const [notes, setNotes] = useState('');

  const queryClient = useQueryClient();

  // Fetch Appointments
  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => getAppointments(), // In real app, pass current view range
  });

  // Fetch Services
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      handleClose();
    },
  });

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSlot(null);
    setSelectedService('');
    setNotes('');
  };

  const handleSubmit = () => {
    if (selectedSlot && selectedService) {
      createMutation.mutate({
        serviceId: selectedService,
        startDateTime: selectedSlot.start.toISOString(),
        notes,
      });
    }
  };

  const events = appointments.map((appt) => ({
    id: appt.id,
    title: `${appt.service?.name} - ${appt.client?.user.firstName} ${appt.client?.user.lastName}`,
    start: new Date(appt.startDateTime),
    end: new Date(appt.endDateTime),
    resource: appt,
  }));

  return (
    <Box sx={{ height: 'calc(100vh - 100px)' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Appointments</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            New Appointment
        </Button>
      </Box>

      <Paper sx={{ height: '90%', p: 2 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          selectable
          onSelectSlot={handleSelectSlot}
          defaultView={Views.WEEK}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          onSelectEvent={(event) => alert(`Appointment Details:\nClient: ${event.resource.client?.user.firstName}\nStatus: ${event.resource.status}`)}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Book Appointment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
             {selectedSlot && (
                 <Typography variant="body2" color="text.secondary">
                     Date: {format(selectedSlot.start, 'PPpp')}
                 </Typography>
             )}
             
            <TextField
              select
              label="Service"
              fullWidth
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              {services.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.name} ({service.duration} min) - ${service.price}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!selectedService}>
            Book
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Appointments;

