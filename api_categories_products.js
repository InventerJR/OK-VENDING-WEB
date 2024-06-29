import axios from 'axios';
import { getAPIToken, setAPIToken } from './src/utils/Auth'; // Asegúrate de que la ruta es correcta

const API_BASE_URL_DOS = 'http://192.168.100.5:8000/api';
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


export const registerBrand = async (brand) => {
    try {
        const [token] = getAPIToken();

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.post(`${API_BASE_URL_DOS}/productbrand/register_brand/`, brand, {
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

export const listBrand = async (pageUrl = `${API_BASE_URL_DOS}/productbrand/list_Brands/`) => {
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
        console.log('Token:', token); // Añadir para depurar

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.post(`${API_BASE_URL_DOS}/products/register_product/`, formData, {
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
export const listProducts = async (pageUrl = `${API_BASE_URL_DOS}/products/get_products/`) => {
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
        console.log('Token:', token); // Añadir para depurar

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const formData = new FormData();
        for (const key in productData) {
            formData.append(key, productData[key]);
        }

        const response = await axios.put(`${API_BASE_URL_DOS}/products/update_product/`, formData, {
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
        console.log('Token:', token); // Añadir para depurar

        if (!token) {
            throw new Error("No token found, please log in again.");
        }

        const response = await axios.get(`${API_BASE_URL_DOS}/products/get_product/`, {
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

        console.log("Enviando solicitud de eliminación para UUID:", uuid); // Agrega este log

        const response = await axios.delete(`${API_BASE_URL_DOS}/productbrand/delete_brand/`, {
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

        console.log("Enviando solicitud de eliminación para UUID:", uuid); // Agrega este log

        const response = await axios.delete(`${API_BASE_URL_DOS}/products/delete_product/`, {
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
