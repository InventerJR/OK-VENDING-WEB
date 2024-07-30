import axios from 'axios';
import { getAPIToken, setAPIToken } from './src/utils/Auth';
import { CONSTANTS } from '@/constants';  // Asegúrate de que la ruta es correcta
import { localStorageWrapper } from '@/utils/localStorageWrapper';

//const CONSTANTS.API_BASE_URL = 'http://192.168.100.5:8000/api';
//export const AWS_BASE_URL = 'https://ok-vending.s3.amazonaws.com/';
//export const API_BASE_URL = 'https://okvending.pythonanywhere.com/api';


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

export const getProducts = async (pageUrl = `${CONSTANTS.API_BASE_URL}/products/get_products/`) => {
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

export const loadWaggon = async (loadWaggon) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }
        
        const response = await axios.post(`${CONSTANTS.API_BASE_URL}/inventories/load_waggon/`, loadWaggon, {
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

export const getProductStockByUUID = async (uuid) => {
    try {
        const [token] = getAPIToken();
        console.log('Token:', token); // Añadir para depurar

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