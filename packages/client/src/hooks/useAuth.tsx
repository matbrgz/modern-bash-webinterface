import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface LoginData {
  username: string;
  password: string;
}

interface User {
  username: string;
  roles: string[];
}

const API_URL = import.meta.env.VITE_API_URL || '';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/config`);
      return response.json();
    },
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token && config?.authEnabled) {
        return null;
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      return response.json() as Promise<User>;
    },
    enabled: config !== undefined,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      queryClient.setQueryData(['user'], data.user);
      navigate('/');
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    queryClient.setQueryData(['user'], null);
    navigate('/login');
  };

  return {
    user,
    isAuthenticated: !!user || !config?.authEnabled,
    isLoading,
    login: loginMutation.mutate,
    logout,
    isAuthEnabled: config?.authEnabled || false,
  };
} 
