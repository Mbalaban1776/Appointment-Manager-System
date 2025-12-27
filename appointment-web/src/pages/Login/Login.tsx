import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  Tab,
  Tabs
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../services/auth/authStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginInputs = z.infer<typeof loginSchema>;
type RegisterInputs = z.infer<typeof registerSchema>;

const Login: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSubmit = async (data: LoginInputs) => {
    try {
      setError(null);
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const onRegisterSubmit = async (data: RegisterInputs) => {
    try {
      setError(null);
      await register(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Appointment Manager
          </Typography>
          
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ mb: 3 }}>
             <Tab label="Login" />
             <Tab label="Register" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {tab === 0 ? (
            <Box component="form" onSubmit={handleSubmitLogin(onLoginSubmit)} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                {...registerLogin('email')}
                error={!!loginErrors.email}
                helperText={loginErrors.email?.message}
              />
                <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...registerLogin('password')}
                error={!!loginErrors.password}
                helperText={loginErrors.password?.message}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoginSubmitting}
              >
                {isLoginSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>
          ) : (
             <Box component="form" onSubmit={handleSubmitRegister(onRegisterSubmit)} noValidate>
               <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="First Name"
                    {...registerRegister('firstName')}
                    error={!!registerErrors.firstName}
                    helperText={registerErrors.firstName?.message}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Last Name"
                    {...registerRegister('lastName')}
                    error={!!registerErrors.lastName}
                    helperText={registerErrors.lastName?.message}
                />
               </Box>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                {...registerRegister('email')}
                error={!!registerErrors.email}
                helperText={registerErrors.email?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                {...registerRegister('password')}
                error={!!registerErrors.password}
                helperText={registerErrors.password?.message}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isRegisterSubmitting}
              >
                {isRegisterSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;

