/**
 * Created by jovialis (Dylan Hanson) on 1/27/22.
 */

import {Avatar, Box, Button, Center, HStack, Text, Badge} from "@chakra-ui/react";
import Google from "../assets/google.svg";
import {Dispatch, useEffect, useState} from "react";
import {createAxios} from "../utils/axios.util";
import {useRouter} from "next/router.js";

export interface ExportUser {
    name: string,
    email: string,
    portrait: string
}

interface LoginOptions {
    google: string
}

interface ILoginButton {
    updateUser: Dispatch<ExportUser>
}

export function LoginButton(props?: ILoginButton) {
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [loginOptions, setLoginOptions] = useState<LoginOptions | null>(null);
    const [user, setUser] = useState<{ name: string, email: string, portrait: string } | null>(null);

    // Logout button
    function logout() {
        setLoading(true);

        const axios = createAxios();
        axios({
            method: 'get',
            url: '/auth/logout'
        }).then(res => {
            console.log('Logged out.');
        }).catch(console.log).finally(() => {
            router.reload();
        })
    }

    useEffect(() => {
        const axios = createAxios();
        axios({
            method: 'get',
            url: '/auth'
        }).then(res => {
            if (res.data.user) {
                setUser(res.data.user);
                props?.updateUser(res.data.user);
            } else {
                setLoginOptions(res.data);
            }
        }).catch(console.log).finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <Button
            className={'login_button'}
            variant={"outline"}
            color={"black"}
            borderColor={"black"}
            isLoading={true}
        >
            Login with VU Mail
        </Button>
    }

    if (user) {
        return <Button
            variant={"outline"}
            color={"black"}
            borderColor={"black"}
            onClick={logout}
            pos={"relative"}
            sx={{
                "& .logout-overlay": {
                    transition: "0.1s opacity"
                },
                "&:hover .logout-overlay": {
                    opacity: 1
                }
            }}
        >
            <HStack spacing={2}>
                <Avatar
                    borderColor={"black"}
                    borderWidth={1}
                    size={"sm"}
                    name={user.name}
                    src={user.portrait}
                />
                <Text>
                    {user.name}
                </Text>
            </HStack>

            <Box
                className={'logout-overlay'}
                h={"100%"}
                w={"100%"}
                bg={"white"}
                pos={"absolute"}
                rounded={"md"}
                opacity={0}
                // borderColor={"black"}
            >
                <Center h={"100%"}>
                    <Text fontSize={"sm"}>Logout</Text>
                </Center>
            </Box>

        </Button>
    }

    return <Button
        className={'login_button'}
        variant={"outline"}
        color={"black"}
        borderColor={"black"}
        isLoading={loading}
        onClick={() => {
            if (loginOptions?.google) {
                // @ts-ignore
                window.location.replace(loginOptions.google);
            }
        }}
        sx={{
            "&:not(:hover) path": {
                fill: "black"
            },
            "& path": {
                transition: "0.3s fill"
            }
        }}
    >
        <Box mr={2}>
            <Google/>
        </Box>
        Login with VU Mail
    </Button>
}