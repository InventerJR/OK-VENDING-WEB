export const CONSTANTS = {
	APP_NAME: "ERP OK VENDING",
	APP_VERSION: "1.0.0",
	APP_YEAR: new Date().getFullYear(),
	APP_OWNER: "OK VENDING",
	APP_OWNER_URL: "",
};

export const APP_ROUTES = {
	ACCESS: {
		LOGIN: "/access/login",
		// REGISTER: '/register',
		FORGOT_PASSWORD: "/access/forgot-password",
		RESET_PASSWORD: "/access/reset-password",
		// VERIFY_EMAIL: '/verify-email',
	},
	HOME: "/home/",
	DASHBOARD: "/home/dashboard",
	USER_ADMIN: "/home/usuarios",
	STORAGE_ADMIN: "/home/almacen",
	PURCHASES_ADMIN: "/home/almacen/compras",
	SALES_ADMIN: "/home/almacen/ventas",
	INVENTORY_ADMIN: "/home/almacen/inventario",
};



export const SIDEBAR_LINKS = [
    {
        label: 'Dashboard',
        icon: '/img/sidebar/dashboard.svg',
        path: APP_ROUTES.DASHBOARD
    },
    {
        label: 'Usuarios',
        icon: '/img/sidebar/user.svg',
        path: APP_ROUTES.USER_ADMIN
    },
    {
        label: 'Almacen',
        icon: '/img/sidebar/storage.svg',
        path: APP_ROUTES.STORAGE_ADMIN
    },
    {
        label: 'Cargas',
        icon: '/img/sidebar/upload.svg',
        path: APP_ROUTES.PURCHASES_ADMIN
    },
    {
        label: 'Ventas',
        icon: '/img/sidebar/inputs-outputs.svg',
        path: APP_ROUTES.SALES_ADMIN
    },
    {
        label: 'Productos',
        icon: '/img/sidebar/products.svg',
        path: APP_ROUTES.INVENTORY_ADMIN
    },
    {
        label: 'Cerrar sesión',
        icon: '/img/sidebar/logout.svg',
        path: APP_ROUTES.ACCESS.LOGIN
    },
]