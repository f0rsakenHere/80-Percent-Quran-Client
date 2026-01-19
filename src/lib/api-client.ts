import axios, { AxiosError } from 'axios';
import { auth } from './firebase';

// Create axios instance
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 seconds
});

// Request interceptor: Auto-attach Firebase token
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting Firebase token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Unauthorized - redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        // Log error for debugging
        console.error('API Error:', {
            message: error.message,
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
        });

        return Promise.reject(error);
    }
);

export default apiClient;
