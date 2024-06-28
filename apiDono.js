import axios from 'axios';
import { getAPIToken, setAPIToken } from './src/utils/Auth'; // Asegúrate de que la ruta es correcta

const API_BASE_URL = 'http://192.168.1.36:8000/api';
export const AWS_BASE_URL = 'https://ok-vending.s3.amazonaws.com/';


export const getSuppliers = async (pageUrl = `${API_BASE_URL}/suppliers/get_suppliers/`) => {
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

        const response = await axios.post(`${API_BASE_URL}/suppliers/register_supplier/`, suppliersData, {
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

        const response = await axios.put(`${API_BASE_URL}/suppliers/update_supplier/`, suppliersData, {
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

        const response = await axios.delete(`${API_BASE_URL}/suppliers/delete_supplier/`, {
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