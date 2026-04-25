import { api } from './client';

export const AuthService = {
    register: (data: any) => api.post('/users/register', data),
    login: (data: any) => api.post('/users/login', data),
    logout: () => api.post('/users/logout', {}),
    getProfile: (userId: string) => api.get(`/users/${userId}`),
    updateProfile: (userId: string, data: any) => api.put(`/users/${userId}`, data),
    getAllUsers: () => api.get('/users'),
};

export const InventoryService = {
    getAllRooms: () => api.get('/inventory/rooms'),
    getAllRoomTypes: () => api.get('/inventory/room-types'),
    getAvailability: (checkIn: string, checkOut: string, guests: number) => 
        api.get(`/inventory/rooms/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`),
    getRoomType: (id: number) => api.get(`/inventory/room-types/${id}`),
    createRoomType: (data: any) => api.post('/inventory/room-types', data),
    createRoom: (data: any) => api.post('/inventory/rooms', data),
};

export const BookingService = {
    createBooking: (data: any) => api.post('/bookings', data),
    getAllBookings: () => api.get('/bookings'),
    getUserBookings: (userId: string) => api.get(`/bookings/user/${userId}`),
    updateStatus: (id: number, status: string) => api.patch(`/bookings/${id}/status`, { status }),
};

export const PaymentService = {
    createPayment: (data: any) => api.post('/payments', data),
    getPaymentByReservation: (reservationId: number) => api.get(`/payments/reservation/${reservationId}`),
};
