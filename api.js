import axios from 'axios';
import { getAPIToken } from './src/utils/Auth';

const API_BASE_URL = 'http://192.168.100.222:8000/api'
export const AWS_BASE_URL = 'https://ok-vending.s3.amazonaws.com/'

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/login/`, {
            email,
            password
        });
        console.log("RESPONSEEEEE:", response);
        return response.data;
    } catch (error) {
        console.log("ERRROOOOOR", error);
        throw error;
    }
};