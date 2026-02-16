//All API ENPOINTS
export const API = {
    AUTH: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        ME: "/api/auth/me",
        REQUEST_PASSWORD_RESET: "/api/auth/request-password-reset",
        RESET_PASSWORD: "/api/auth/reset-password"
    },
    USER: {
        UPDATEPROFILE: "/api/profile/updateProfile"
    },
    TRANSACTIONS: {
        BENEFICIARY: "/api/transactions/beneficiary",
        PREVIEW: "/api/transactions/preview",
        CONFIRM: "/api/transactions/confirm"
    },
    ADMIN: {
        USER: {
            CREATE: '/api/admin/users',
            READALL: '/api/admin/users',
            UPDATE: '/api/admin/users/:id',
            DELETE: '/api/admin/users/:id',
            READONE: '/api/admin/users/:id'
        },
        FLIGHT: {
            CREATE: "/api/admin/flights",
            READALL: "/api/admin/flights",
            UPDATE: "/api/admin/flights/:id",
            DELETE: "/api/admin/flights/:id",
            READONE: "/api/admin/flights/:id"
        },
        HOTEL: {
            CREATE: "/api/admin/hotels",
            READALL: "/api/admin/hotels",
            UPDATE: "/api/admin/hotels/:id",
            DELETE: "/api/admin/hotels/:id",
            READONE: "/api/admin/hotels/:id"
        }
    }
}
