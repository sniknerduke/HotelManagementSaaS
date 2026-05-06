// Centralized API Client for Hotel PMS Frontend
// Using native fetch API to communicate via Vite proxy -> Kong Gateway -> Quarkus Microservices

const BASE_URL = '/api'; // Proxied to localhost:8000 via vite.config.ts

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        let errorData = {};
        try {
            errorData = await response.json();
        } catch (e) {
            // handle empty body on non-ok status
        }
        const errorMessage = (errorData as any).error 
            || ((errorData as any).errors && (errorData as any).errors[0]?.message) 
            || `API request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }
    
    // Check if the response is empty (like 204 No Content)
    if (response.status === 204) {
        return null;
    }

    // Also check for empty responses that aren't 204 but have no body
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    
    const text = await response.text();
    return text ? JSON.parse(text) : null;
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
