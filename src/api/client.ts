// Centralized API Client for Hotel PMS Frontend
// Using native fetch API to communicate via Vite proxy -> Kong Gateway -> Quarkus Microservices

const BASE_URL = '/api'; // Proxied to localhost:8000 via vite.config.ts

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }
    return response.json();
};

const getToken = () => localStorage.getItem('auth_token');

const request = async (endpoint: string, options: RequestInit = {}) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    const token = getToken();
    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    return handleResponse(response);
};

export const api = {
    get: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint: string, data: any, options?: RequestInit) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint: string, data: any, options?: RequestInit) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
    patch: (endpoint: string, data: any, options?: RequestInit) => request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
    delete: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'DELETE' })
};
