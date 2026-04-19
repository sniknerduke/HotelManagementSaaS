import { api } from './client';

export const AuthService = {
    register: (data: any) => api.post('/users/register', data),
    login: (data: any) => api.post('/users/login', data),
    getProfile: (userId: string) => api.get(`/users/${userId}`),
};

export const InventoryService = {
    getAvailability: (checkIn: string, checkOut: string, guests: number) => 
        api.get(`/inventory/rooms/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`),
    getRoomType: (id: number) => api.get(`/inventory/room-types/${id}`),
    createRoomType: (data: any) => api.post('/inventory/room-types', data),
    createRoom: (data: any) => api.post('/inventory/rooms', data),
};

export const BookingService = {
    createBooking: (data: any) => api.post('/bookings', data),
    getUserBookings: (userId: string) => api.get(`/bookings/user/${userId}`),
    updateStatus: (id: number, status: string) => api.patch(`/bookings/${id}/status`, { status }),
};

export const PaymentService = {
    createPayment: (data: any) => api.post('/payments', data),
    getPaymentByReservation: (reservationId: number) => api.get(`/payments/reservation/${reservationId}`),
};
