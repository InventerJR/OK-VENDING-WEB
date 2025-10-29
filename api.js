import axios from 'axios';
import { getAPIToken, setAPIToken } from './src/utils/Auth';
import { CONSTANTS } from '@/constants';
import { localStorageWrapper } from '@/utils/localStorageWrapper';

// Prefer environment override for asset host, defaulting to S3 bucket
export const AWS_BASE_URL = process.env.NEXT_PUBLIC_AWS_BASE_URL || 'http://localhost:9000';


// ---------------------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------------------
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${CONSTANTS.API_BASE_URL}/users/login/`, {
            email,
            password
        });
        console.log("Response data:", response.data); // Log the response data
        const { token, data } = response.data;
        if (token && data) {
            setAPIToken(token, data);
            return { token, user: data }; // Return the token and user data correctly
        } else {
            console.error("Login response missing token or user data");
            throw new Error("Login response missing token or user data");
        }
    } catch (error) {
        console.error("Error logging in:", error); // Log any errors
        throw error;
    }
};


// ---------------------------------------------------------------------------
// USERS
// ---------------------------------------------------------------------------
export const registerUser = async (userData) => {
    try {
        const formData = new FormData();
        Object.keys(userData).forEach(key => {
            formData.append(key, userData[key]);
        });

        const [token] = getAPIToken();
        console.log('Token:', token); // Añadir para depurar

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.post(`${CONSTANTS.API_BASE_URL}/users/register_user/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `JWT ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

export const getUsers = async (pageUrl = `${CONSTANTS.API_BASE_URL}/users/get_users/`) => {
    try {
        if (typeof window === 'undefined') {
            return {
                results: [],
                count: 0,
                current: 1,
                next: null,
                previous: null,
            };
        }

        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (userData) => {
    try {
        const [token] = getAPIToken();
        console.log('Token:', token); // Añadir para depurar

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const formData = new FormData();
        for (const key in userData) {
            formData.append(key, userData[key]);
        }

        const response = await axios.put(`${CONSTANTS.API_BASE_URL}/users/update_user/`, formData, {
            headers: {
                'Authorization': `JWT ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const getUserByUUID = async (uuid) => {
    try {
        const [token] = getAPIToken();
        console.log('Token:', token); // Añadir para depurar

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(`${CONSTANTS.API_BASE_URL}/users/get_user_by_uuid/`, {
            params: { uuid },
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data.data;
    } catch (error) {
        console.error("Error fetching user by UUID:", error);
        throw error;
    }
};

export const deleteUser = async (uuid) => {
    try {
        const [token] = getAPIToken();
        console.log('Token:', token); // Añadir para depurar

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.delete(`${CONSTANTS.API_BASE_URL}/users/delete_user/`, {
            data: { uuid },
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};


// ---------------------------------------------------------------------------
// WAREHOUSE PLACES
// ---------------------------------------------------------------------------
export const getWarehousePlaces = async (pageUrl = `${CONSTANTS.API_BASE_URL}/warehouse_places/get_warehouse_places/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching warehouse places:", error);
        throw error;
    }
};

export const getWarehousesByUser = async () => {
    try {
        // Obtiene el token de autenticación
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No se encontró el token, por favor inicia sesión nuevamente.");
        }

        // Realiza la solicitud al endpoint
        const response = await axios.get(`${CONSTANTS.API_BASE_URL}/warehouse_places/list_warehouses_by_user/`, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error al obtener los almacenes por usuario:", error);
        throw error;
    }
};

export const getAllWarehousePlaces = async (pageUrl = `${CONSTANTS.API_BASE_URL}/warehouse_places/get_all_warehouse_places/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching warehouse places:", error);
        throw error;
    }
};

export const createWarehousePlace = async (warehouseData) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.post(`${CONSTANTS.API_BASE_URL}/warehouse_places/create_warehouse_place/`, warehouseData, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error creating warehouse place:", error);
        throw error;
    }
};

export const updateWarehousePlace = async (warehouseData) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.put(`${CONSTANTS.API_BASE_URL}/warehouse_places/update_warehouse_place/`, warehouseData, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error updating warehouse place:", error);
        throw error;
    }
};

export const deleteWarehousePlace = async (uuid) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.delete(`${CONSTANTS.API_BASE_URL}/warehouse_places/delete_warehouse_place/`, {
            data: { uuid },
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error deleting warehouse place:", error);
        throw error;
    }
};

// ---------------------------------------------------------------------------
// WAREHOUSE WAGGONS
// ---------------------------------------------------------------------------
export const getWarehouseWaggons = async (pageUrl = `${CONSTANTS.API_BASE_URL}/warehouses_waggon/get_all_warehouse_waggons/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching warehouse places:", error);
        throw error;
    }
};

export const createWarehouseWaggon = async (warehouseWaggonData) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.post(`${CONSTANTS.API_BASE_URL}/warehouses_waggon/create_warehouse_waggon/   `, warehouseWaggonData, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error creating warehouse place:", error);
        throw error;
    }
};

export const updateWarehouseWaggon = async (warehouseWaggonData) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.put(`${CONSTANTS.API_BASE_URL}/warehouses_waggon/update_warehouse_waggon/`, warehouseWaggonData, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error updating warehouse place:", error);
        throw error;
    }
};

export const deleteWarehouseWaggon = async (uuid) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.delete(`${CONSTANTS.API_BASE_URL}/warehouses_waggon/delete_warehouse_waggon/`, {
            data: { uuid },
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error deleting warehouse place:", error);
        throw error;
    }
};


export const createWarehouseMachine = async (warehouseMachineData) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.post(`${CONSTANTS.API_BASE_URL}/warehouses_machine/create_warehouse_machine/`, warehouseMachineData, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error creating warehouse place:", error);
        throw error;
    }
};


export const getWarehouseMachines = async (pageUrl = `${CONSTANTS.API_BASE_URL}/warehouses_machine/get_all_warehouse_machines/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching warehouse machines:", error);
        throw error;
    }
};

export const getProducts = async (pageUrl = `${CONSTANTS.API_BASE_URL}/products/get_all_products/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};


export const updateWarehouseMachine = async (warehouseMachineData) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.put(`${CONSTANTS.API_BASE_URL}/warehouses_machine/update_warehouse_machine/`, warehouseMachineData, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error updating warehouse machine:", error);
        throw error;
    }
};

export const getWarehouseMachineByUUID = async (uuid) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(`${CONSTANTS.API_BASE_URL}/warehouses_machine/get_warehouse_machine_by_uuid/`, {
            headers: {
                'Authorization': `JWT ${token}`
            },
            params: {
                uuid: uuid
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching warehouse machine:", error);
        throw error;
    }
};

export const deleteWarehouseMachine = async (machine_uuid, warehouse_place_uuid) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.delete(`${CONSTANTS.API_BASE_URL}/warehouses_machine/delete_warehouse_machine/`, {
            data: { machine_uuid, warehouse_place_uuid },
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error deleting warehouse machine:", error);
        throw error;
    }
};

export const getWarehousesMachineAddresses = async (pageUrl = `${CONSTANTS.API_BASE_URL}/warehouses_machine/get_all_warehouse_machine_addresses/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const getWarehouseWaggonStockByUUID = async (uuid) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(`${CONSTANTS.API_BASE_URL}/warehouses_waggon/get_warehouse_waggon_stock_by_uuid/`, {
            headers: {
                'Authorization': `JWT ${token}`
            },
            params: {
                uuid: uuid
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching warehouse machine:", error);
        throw error;
    }
};

export const getWarehousePlaceStockByUUID = async (uuid) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(`${CONSTANTS.API_BASE_URL}/warehouse_places/get_warehouse_place_stock_by_uuid/`, {
            headers: {
                'Authorization': `JWT ${token}`
            },
            params: {
                uuid: uuid
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching warehouse machine:", error);
        throw error;
    }
};

export const getWarehouseMachineStockByUUID = async (uuid) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(`${CONSTANTS.API_BASE_URL}/warehouses_machine/get_warehouse_machine_stock_by_uuid/`, {
            headers: {
                'Authorization': `JWT ${token}`
            },
            params: {
                uuid: uuid
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching warehouse machine:", error);
        throw error;
    }
};


export const getTotalInventoryValue = async (pageUrl = `${CONSTANTS.API_BASE_URL}/inventories/get_total_inventory_value/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching total inventory:", error);
        throw error;
    }
};

export const getAllProducts = async (pageUrl = `${CONSTANTS.API_BASE_URL}/products/get_products/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const getAllSuppliers = async (pageUrl = `${CONSTANTS.API_BASE_URL}/suppliers/get_all_suppliers/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};


export const registerPurchase = async (registerPurchaseData) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.post(`${CONSTANTS.API_BASE_URL}/inventories/register_purchase/`, registerPurchaseData, {
            headers: {
                'Authorization': `JWT ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error register purchase:", error);
        throw error;
    }
};

export const registerCompanyMovement = async (registerCompanyMovementData) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.post(`${CONSTANTS.API_BASE_URL}/companies_movements/create_movement/`, registerCompanyMovementData, {
            headers: {
                'Authorization': `JWT ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error register purchase:", error);
        throw error;
    }
};

export const getAllPurchases = async (pageUrl = `${CONSTANTS.API_BASE_URL}/inventories/get_all_purchases/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching company movements:", error);
        throw error;
    }
};

// ---------------------------------------------------------------------------
// CATEGORIES & BRANDS
// ---------------------------------------------------------------------------
export const getCategories = async (pageUrl = `${CONSTANTS.API_BASE_URL}/productcategories/list_categories/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

export const createCategory = async (categoryData) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.post(`${CONSTANTS.API_BASE_URL}/productcategories/register_category/`, categoryData, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error creating warehouse place:", error);
        throw error;
    }
};

export const deleteCategory = async ({ uuid }) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        console.log("Enviando solicitud de eliminación para UUID:", uuid);

        const response = await axios.delete(`${CONSTANTS.API_BASE_URL}/productcategories/delete_category/`, {
            headers: {
                'Authorization': `JWT ${token}`
            },
            data: { uuid }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};

export const updateCategory = async (category) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.put(`${CONSTANTS.API_BASE_URL}/productcategories/edit_category/`, category, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

export const registerBrand = async (brand) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.post(`${CONSTANTS.API_BASE_URL}/productbrand/register_brand/`, brand, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error registering brand:", error);
        throw error;
    }
};

export const listBrand = async (pageUrl = `${CONSTANTS.API_BASE_URL}/productbrand/list_Brands/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching brands:", error);
        throw error;
    }
};

export const registerProduct = async (productData) => {
    try {
        const formData = new FormData();
        Object.keys(productData).forEach(key => {
            formData.append(key, productData[key]);
        });

        const [token] = getAPIToken();
        console.log('Token:', token);

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.post(`${CONSTANTS.API_BASE_URL}/products/register_product/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `JWT ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error registering product:", error);
        throw error;
    }
};

export const listProducts = async (pageUrl = `${CONSTANTS.API_BASE_URL}/products/get_products/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const updateProduct = async (productData) => {
    try {
        const [token] = getAPIToken();
        console.log('Token:', token);

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const formData = new FormData();
        for (const key in productData) {
            formData.append(key, productData[key]);
        }

        const response = await axios.put(`${CONSTANTS.API_BASE_URL}/products/update_product/`, formData, {
            headers: {
                'Authorization': `JWT ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const getProductByUUID = async (uuid) => {
    try {
        const [token] = getAPIToken();
        console.log('Token:', token);

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(`${CONSTANTS.API_BASE_URL}/products/get_product/`, {
            params: { uuid },
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data.data;
    } catch (error) {
        console.error("Error fetching PRODUCT by UUID:", error);
        throw error;
    }
};

export const deleteBrand = async ({ uuid }) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        console.log("Enviando solicitud de eliminación para UUID:", uuid);

        const response = await axios.delete(`${CONSTANTS.API_BASE_URL}/productbrand/delete_brand/`, {
            headers: {
                'Authorization': `JWT ${token}`
            },
            data: { uuid }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};

export const deleteProduct = async ({ uuid }) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        console.log("Enviando solicitud de eliminación para UUID:", uuid);

        const response = await axios.delete(`${CONSTANTS.API_BASE_URL}/products/delete_product/`, {
            headers: {
                'Authorization': `JWT ${token}`
            },
            data: { uuid }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};

export const getProductStockByUUID = async (uuid) => {
    try {
        const [token] = getAPIToken();
        console.log('Token:', token);

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(`${CONSTANTS.API_BASE_URL}/warehouse_places/get_warehouse_place_stock_by_uuid/`, {
            params: { uuid },
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching PRODUCT by UUID:", error);
        throw error;
    }
};

export const listWarehousesPlaces = async (pageUrl = `${CONSTANTS.API_BASE_URL}/warehouse_places/get_all_warehouse_places/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const manualSale = async (product_uuid, quantity, warehouse_uuid) => {
    try {
        const token = localStorageWrapper.getItem('token');
        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.post(`${CONSTANTS.API_BASE_URL}/inventories/manual_sale/`, {
            product_uuid,
            quantity,
            warehouse_uuid
        }, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error processing manual sale:", error);
        throw error;
    }
};


// ---------------------------------------------------------------------------
// SUPPLIERS
// ---------------------------------------------------------------------------

export const getSuppliers = async (pageUrl = `${CONSTANTS.API_BASE_URL}/suppliers/get_suppliers/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        throw error;
    }
};

export const createSuppliers = async (suppliersData) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.post(`${CONSTANTS.API_BASE_URL}/suppliers/register_supplier/`, suppliersData, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error creating supplier:", error);
        throw error;
    }
};

export const updateSuppliers = async (suppliersData) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.put(`${CONSTANTS.API_BASE_URL}/suppliers/update_supplier/`, suppliersData, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error updating supplier:", error);
        throw error;
    }
};

export const deleteSuppliers = async (uuid) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.delete(`${CONSTANTS.API_BASE_URL}/suppliers/delete_supplier/`, {
            data: { uuid },
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error deleting supplier:", error);
        throw error;
    }
};

export const loadWaggon = async (loadWaggonData) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.post(`${CONSTANTS.API_BASE_URL}/inventories/load_waggon/`, loadWaggonData, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.log("Error creating LOAD:", CONSTANTS.API_BASE_URL, error);
        throw error;
    }
};

// ---------------------------------------------------------------------------
// COMPANY MOVEMENTS & PROFITS
// ---------------------------------------------------------------------------

export const getProfit = async (pageUrl = `${CONSTANTS.API_BASE_URL}/inventories/get_ganancia/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching profits:", error);
        throw error;
    }
};

export const getCompanyMovements = async (pageUrl = `${CONSTANTS.API_BASE_URL}/companies_movements/get_movements/`) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(pageUrl, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching company movements:", error);
        throw error;
    }
};