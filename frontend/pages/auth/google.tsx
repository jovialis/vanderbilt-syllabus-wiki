/**
 * Created by jovialis (Dylan Hanson) on 1/27/22.
 */
import {useRouter} from "next/router.js";
import {useEffect} from "react";
import {Center, CircularProgress, Text, VStack} from "@chakra-ui/react";
import {createAxios} from "../../utils/axios.util";

export default function GooglePage() {
    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            const axios = createAxios();
            axios({
                method: 'get',
                url: '/auth/google/token',
                params: router.query
            }).then(res => {
                router.replace('/');
            }).catch(err => {
                console.log(err);
            });
        }
    }, [router.isReady]);

    return <>
        <Center h={"100vh"} bg={"orange"}>
            <VStack>
                <CircularProgress thickness={5} isIndeterminate color={"black"}/>
                <Text>{"We're"} logging you in...</Text>
            </VStack>
        </Center>
    </>
}