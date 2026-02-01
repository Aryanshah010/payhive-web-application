//All API ENPOINTS
export const API = {
    AUTH: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
    },
    USER: {
        UPDATEPROFILE: "/api/profile/updateProfile"
    },
    ADMIN: {
        USER: {
            CREATE: '/api/admin/users',
            READALL: '/api/admin/users',
            UPDATE: '/api/admin/users/:id',
            DELETE: '/api/admin/users/:id',
            READONE: '/api/admin/users/:id'
        }
    }
}