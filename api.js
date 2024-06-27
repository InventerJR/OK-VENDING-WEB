import axios from 'axios';
import { getAPIToken, setAPIToken } from './src/utils/Auth'; // Asegúrate de que la ruta es correcta

const API_BASE_URL = 'http://192.168.1.9:8000/api';
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