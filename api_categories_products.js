import axios from 'axios';
import { getAPIToken, setAPIToken } from './src/utils/Auth'; // Asegúrate de que la ruta es correcta

const API_BASE_URL_DOS = 'http://192.168.100.79:8000/api';
export const AWS_BASE_URL_DOS = 'https://ok-vending.s3.amazonaws.com/';

export const getCategories = async (pageUrl = `${API_BASE_URL_DOS}/productcategories/list_categories/`) => {
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

        const response = await axios.post(`${API_BASE_URL_DOS}/productcategories/register_category/`, categoryData, {
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

        console.log("Enviando solicitud de eliminación para UUID:", uuid); // Agrega este log

        const response = await axios.delete(`${API_BASE_URL_DOS}/productcategories/delete_category/`, {
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

        const response = await axios.put(`${API_BASE_URL_DOS}/productcategories/edit_category/`,category, {
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