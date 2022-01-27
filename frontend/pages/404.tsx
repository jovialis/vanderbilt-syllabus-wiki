/**
 * Created by jovialis (Dylan Hanson) on 1/26/22.
 */

import React from "react";
import {useRouter} from "next/router.js";
import {useEffect} from "react";

export default function NotFoundPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/')
    }, []);

    return <React.Fragment/>
}