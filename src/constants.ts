export const APP_ROUTES = {
    ACCESS: {
        LOGIN: '/access/login',
        // REGISTER: '/register',
        FORGOT_PASSWORD: '/access/forgot-password',
        RESET_PASSWORD: '/access/reset-password',
        // VERIFY_EMAIL: '/verify-email',
    },
    HOME: '/home/',
    DASHBOARD: '/home/dashboard',
    USER_ADMIN: '/home/usuarios',
    STORAGE_ADMIN: '/home/almacen',
    PURCHASES_ADMIN: '/home/almacen/compras',
    SALES_ADMIN: '/home/almacen/ventas',
    INVENTORY_ADMIN: '/home/almacen/inventario',
}

export const CONSTANTS = {
    APP_NAME: 'ERP OK VENDING',
    APP_VERSION: '1.0.0',
    APP_YEAR: new Date().getFullYear(),
    APP_OWNER: 'OK VENDING',
    APP_OWNER_URL: '',
    ROUTES: APP_ROUTES,
}