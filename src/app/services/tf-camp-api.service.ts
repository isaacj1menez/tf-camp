import axios, { AxiosResponse } from 'axios';

const baseUrl: string = 'http://localhost:2250/api/campers';

const addCamper = async (body: {}): Promise<boolean> => {
    try {
        const response: AxiosResponse = await axios.post(baseUrl, body);
        if(response.data.status){
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
    const campers = await axios.get(baseUrl);
    if(campers.data.status) {
        return campers.data;
    } else {
        return [];
    }
}

const getCamperbyRegisterNumber = async (register: string) => {
    const camper = await axios.get(`${baseUrl}/${register}`);
    if(camper.data.status){
        return camper.data.data;
    } else {
        return null;
    }
}

const addPayment = async (body: {}): Promise<boolean> => {
    try {
        const response: AxiosResponse = await axios.post(baseUrl, body);
        if(response.data.status){
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
        const response: AxiosResponse = await axios.delete(`${baseUrl}?ids=${query}`);
        if(response.data.status){
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}



export {
    addCamper,
    getCampers,
    getCamperbyRegisterNumber,
    addPayment,
    deleteCampers
}