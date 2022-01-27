/**
 * Created by jovialis (Dylan Hanson) on 1/27/22.
 */

import {Avatar, Box, Button, HStack, Text} from "@chakra-ui/react";
import Google from "../assets/google.svg";
import axios from "axios";
import {Dispatch, useEffect, useState} from "react";
import {createAxios} from "../utils/axios.util";

export interface ExportUser {
    name: string, email: string, portrait: string
}

interface LoginOptions {
    google: string
}

interface ILoginButton {
    updateUser: Dispatch<ExportUser>
}

export function LoginButton(props?: ILoginButton) {
    const [loading, setLoading] = useState(true);

    const [loginOptions, setLoginOptions] = useState<LoginOptions | null>(null);
    const [user, setUser] = useState<{name: string, email: string, portrait: string} | null>(null);

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