import axios, { AxiosResponse } from 'axios';

const baseUrl: string = 'http://localhost:2250/api';

const addCamper = async (body: {}): Promise<boolean> => {
    try {
        const response: AxiosResponse = await axios.post(`${baseUrl}/campers`, body);
        if (response.data.status === "success") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getCampers = async () => {
    const campers = await axios.get(`${baseUrl}/campers`);
    if (campers.data.status === "success") {
        return campers.data;
    } else {
        return [];
    }
}

const getPayments = async () => {
    const payments = await axios.get(`${baseUrl}/payments`);
    if (payments.data.status === "success") {
        return payments.data;
    } else {
        return [];
    }
}

const getCamperbyRegisterNumber = async (register: string) => {
    const camper = await axios.get(`${baseUrl}/campers/${register}`);
    if (camper.data.status === "success") {
        return camper.data.data;
    } else {
        return null;
    }
}

const addPayment = async (body: {}): Promise<boolean> => {
    try {
        const response: AxiosResponse = await axios.post(`${baseUrl}/payments`, body);
        if (response.data.status === "success") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

const deleteCampers = async (query: String): Promise<boolean> => {
    try {
        const response: AxiosResponse = await axios.delete(`${baseUrl}/campers?ids=${query}`);
        if (response.data.status === "success") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getPaymentByCamperId = async (id: String): Promise<boolean> => {
    try {
        const payments = await axios.get(`${baseUrl}/payments/${id}`);
        if (payments.data.status === "success") {
            return payments.data.data;
        } else {
            return null;
        }
    } catch (error) {
        return false;
    }
}

export {
    addCamper,
    getCampers,
    getCamperbyRegisterNumber,
    addPayment,
    deleteCampers,
    getPaymentByCamperId,
    getPayments
}