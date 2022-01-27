/**
 * Created by jovialis (Dylan Hanson) on 1/26/22.
 */

import {useEffect, useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {createAxios} from "./axios.util";

export interface UseFetchUtil<T> {
    onData?: (data: T) => void,
    onError?: (error: Error) => void
}

/**
 * https://react-typescript-cheatsheet.netlify.app/docs/basic/useful-hooks
 */
export function useFetch<T>(request?: AxiosRequestConfig, utils?: UseFetchUtil<T>) {
    const [data, setData] = useState<null | T>(null);
    const [error, setError] = useState<Error | null>();
    const [loading, setIsLoading] = useState<boolean>(!!request);

    useEffect(() => {
        if (!request)
            return;

        const abortController = new AbortController();
        setIsLoading(true);
        setData(null);
        setError(null);
        (async () => {
            try {
                const axios = createAxios();
                const response = await axios(request);

                // Trigger handler
                if (utils?.onData) {
                    utils?.onData(response.data);
                }

                setData(response.data);
                setError(null);
                setIsLoading(false);
            } catch (error: any) {
                // Trigger handler
                if (utils?.onError) {
                    utils?.onError(error);
                }

                setError(error);
                setData(null);
                setIsLoading(false);
            }
        })();
        return () => {
            abortController.abort();
        };
    }, [request]);

    return {data, error, loading};
}