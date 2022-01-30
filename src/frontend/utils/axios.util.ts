/**
 * Created by jovialis (Dylan Hanson) on 1/27/22.
 */
import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

export function createAxios(config?: AxiosRequestConfig): AxiosInstance {
    return axios.create({
        baseURL: '/api',
        withCredentials: true,
        ...(config || {})
    });
}