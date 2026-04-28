import { api } from './client';

export const AuthService = {
    register: (data: any) => api.post('/users/register', data),
    login: (data: any) => api.post('/users/login', data),
    logout: () => api.post('/users/logout', {}),
    getProfile: (userId: string) => api.get(`/users/${userId}`),
    updateProfile: (userId: string, data: any) => api.put(`/users/${userId}`, data),
    changePassword: (userId: string, data: any) => api.put(`/users/${userId}/password`, data),
    getAllUsers: () => api.get('/users'),
    updateRole: (userId: string, role: string) => api.patch(`/users/${userId}/role`, { role }),
    deleteUser: (userId: string) => api.delete(`/users/${userId}`),
};

export const InventoryService = {
    getAllRooms: () => api.get('/inventory/rooms'),
    getAllRoomTypes: () => api.get('/inventory/room-types'),
    getAvailability: (checkIn: string, checkOut: string, guests: number) => 
        api.get(`/inventory/rooms/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`),
    getRoomType: (id: number) => api.get(`/inventory/room-types/${id}`),
    createRoomType: (data: any) => api.post('/inventory/room-types', data),
    updateRoomType: (id: number, data: any) => api.put(`/inventory/room-types/${id}`, data),
    deleteRoomType: (id: number) => api.delete(`/inventory/room-types/${id}`),
    createRoom: (data: any) => api.post('/inventory/rooms', data),
    updateRoom: (id: number, data: any) => api.put(`/inventory/rooms/${id}`, data),
    deleteRoom: (id: number) => api.delete(`/inventory/rooms/${id}`),
    updateRoomStatus: (id: number, status: string) => api.patch(`/inventory/rooms/${id}/status`, { status }),
};

export const BookingService = {
    createBooking: (data: any) => api.post('/bookings', data),
    getAllBookings: () => api.get('/bookings'),
    getUserBookings: (userId: string) => api.get(`/bookings/user/${userId}`),
    updateStatus: (id: number, status: string) => api.patch(`/bookings/${id}/status`, { status }),
    updateBooking: (id: number, data: any) => api.put(`/bookings/${id}`, data),
    cancelBooking: (id: number) => api.delete(`/bookings/${id}`),
    checkIn: (id: number) => api.post(`/bookings/${id}/check-in`, {}),
    checkOut: (id: number) => api.post(`/bookings/${id}/check-out`, {}),
};

export const PaymentService = {
    createPayment: (data: any) => api.post('/payments', data),
    getPaymentByReservation: (reservationId: number) => api.get(`/payments/reservation/${reservationId}`),
    getAllPayments: () => api.get('/payments'),
    getPaymentDetails: (id: number) => api.get(`/payments/${id}`),
    processRefund: (id: number) => api.post(`/payments/${id}/refund`, {}),
};

export const AnalyticsService = {
    getOverview: () => api.get('/analytics/overview'),
    getBookings: (period: string = '30d') => api.get(`/analytics/bookings?period=${period}`),
    getRevenue: (period: string = '30d') => api.get(`/analytics/revenue?period=${period}`),
    getOccupancy: () => api.get('/analytics/occupancy'),
    getTodayStats: () => api.get('/analytics/today'),
};
