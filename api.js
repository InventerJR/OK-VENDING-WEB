import axios from 'axios';
import { getAPIToken, setAPIToken } from './src/utils/Auth'; // Asegúrate de que la ruta es correcta

const API_BASE_URL = 'http://192.168.1.11:8000/api';

//const API_BASE_URL = 'https://okvending.pythonanywhere.com/api';
export const AWS_BASE_URL = 'https://ok-vending.s3.amazonaws.com/';


//LOGIN
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/login/`, {
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


//USER SERVICES
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

        const response = await axios.post(`${API_BASE_URL}/users/register_user/`, formData, {
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

export const getUsers = async (pageUrl = `${API_BASE_URL}/users/get_users/`) => {
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

        const response = await axios.put(`${API_BASE_URL}/users/update_user/`, formData, {
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

        const response = await axios.get(`${API_BASE_URL}/users/get_user_by_uuid/`, {
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

        const response = await axios.delete(`${API_BASE_URL}/users/delete_user/`, {
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


//WAREHOUSE PLACE SERVICES
export const getWarehousePlaces = async (pageUrl = `${API_BASE_URL}/warehouse_places/get_warehouse_places/`) => {
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

export const getAllWarehousePlaces = async (pageUrl = `${API_BASE_URL}/warehouse_places/get_all_warehouse_places/`) => {
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

        const response = await axios.post(`${API_BASE_URL}/warehouse_places/create_warehouse_place/`, warehouseData, {
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

        const response = await axios.put(`${API_BASE_URL}/warehouse_places/update_warehouse_place/`, warehouseData, {
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

        const response = await axios.delete(`${API_BASE_URL}/warehouse_places/delete_warehouse_place/`, {
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

//WAREHOUSE WAGGON SERVICES
export const getWarehouseWaggons = async (pageUrl = `${API_BASE_URL}/warehouses_waggon/get_all_warehouse_waggons/`) => {
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

        const response = await axios.post(`${API_BASE_URL}/warehouses_waggon/create_warehouse_waggon/   `, warehouseWaggonData, {
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

        const response = await axios.put(`${API_BASE_URL}/warehouses_waggon/update_warehouse_waggon/`, warehouseWaggonData, {
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

        const response = await axios.delete(`${API_BASE_URL}/warehouses_waggon/delete_warehouse_waggon/`, {
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

        const response = await axios.post(`${API_BASE_URL}/warehouses_machine/create_warehouse_machine/`, warehouseMachineData, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error creating warehouse machine:", error);
        throw error;
    }
};


export const getWarehouseMachines = async (pageUrl = `${API_BASE_URL}/warehouses_machine/get_all_warehouse_machines/`) => {
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

export const getProducts = async (pageUrl = `${API_BASE_URL}/products/get_all_products/`) => {
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

        const response = await axios.put(`${API_BASE_URL}/warehouses_machine/update_warehouse_machine/`, warehouseMachineData, {
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

        const response = await axios.get(`${API_BASE_URL}/warehouses_machine/get_warehouse_machine_by_uuid/`, {
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

        const response = await axios.delete(`${API_BASE_URL}/warehouses_machine/delete_warehouse_machine/`, {
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

export const getWarehousesMachineAddresses = async (pageUrl = `${API_BASE_URL}/warehouses_machine/get_all_warehouse_machine_addresses/`) => {
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

        const response = await axios.get(`${API_BASE_URL}/warehouses_waggon/get_warehouse_waggon_stock_by_uuid/`, {
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

        const response = await axios.get(`${API_BASE_URL}/warehouse_places/get_warehouse_place_stock_by_uuid/`, {
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

        const response = await axios.get(`${API_BASE_URL}/warehouses_machine/get_warehouse_machine_stock_by_uuid/`, {
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


export const getTotalInventoryValue = async (pageUrl = `${API_BASE_URL}/inventories/get_total_inventory_value/`) => {
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

export const getAllProducts = async (pageUrl = `${API_BASE_URL}/products/get_products/`) => {
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

export const getAllSuppliers = async (pageUrl = `${API_BASE_URL}/suppliers/get_all_suppliers/`) => {
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

        const response = await axios.post(`${API_BASE_URL}/inventories/register_purchase/`, registerPurchaseData, {
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