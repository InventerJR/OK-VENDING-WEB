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
	ADMIN: {
		// INDEX: "/admin/",
		DASHBOARD: "/admin/dashboard",
		USER_ADMIN: "/admin/usuarios",
		STORAGE_ADMIN: "/admin/almacen",
		PURCHASES_ADMIN: "/admin/almacen/compras",
		SALES_ADMIN: "/admin/almacen/ventas",
		INVENTORY_ADMIN: "/admin/almacen/inventario",
		MACHINES_ADMIN: "/admin/equipos",
		PROVIDERS_ADMIN: "/admin/proveedores",
		PRODUCTS_ADMIN: "/admin/productos",
		CATEGORIES_ADMIN: "/admin/categorias",
	}
};

export const SIDEBAR_LINKS = [
	{
		label: "Dashboard",
		icon: "/img/sidebar/dashboard.svg",
		path: APP_ROUTES.ADMIN.DASHBOARD,
	},
	{
		label: "Usuarios",
		icon: "/img/sidebar/user.svg",
		path: APP_ROUTES.ADMIN.USER_ADMIN,
	},
	{
		label: "Almacen",
		icon: "/img/sidebar/storage.svg",
		path: APP_ROUTES.ADMIN.STORAGE_ADMIN,
	},
	{
		label: "Cargas",
		icon: "/img/sidebar/upload.svg",
		path: APP_ROUTES.ADMIN.PURCHASES_ADMIN,
	},
	{
		label: "Ventas",
		icon: "/img/sidebar/inputs-outputs.svg",
		path: APP_ROUTES.ADMIN.SALES_ADMIN,
	},
	{
		label: "Equipos",
		icon: "/img/sidebar/3_dots.svg",
		path: APP_ROUTES.ADMIN.MACHINES_ADMIN,
	},
	{
		label: "Proveedores",
		icon: "/img/sidebar/bag.svg",
		path: APP_ROUTES.ADMIN.PROVIDERS_ADMIN,
	},
	{
		label: "Productos",
		icon: "/img/sidebar/products.svg",
		path: APP_ROUTES.ADMIN.PRODUCTS_ADMIN,
	},
	{
		label: "Categorías",
		icon: "/img/sidebar/categories.svg",
		path: APP_ROUTES.ADMIN.CATEGORIES_ADMIN,
	},

	{
		label: "Cerrar sesión",
		icon: "/img/sidebar/logout.svg",
		path: APP_ROUTES.ACCESS.LOGIN,
	},
];
