/**
 * Created by jovialis (Dylan Hanson) on 1/26/22.
 */

import React, {useEffect} from "react";
import {useRouter} from "next/router.js";

export default function NotFoundPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/')
    }, []);

    return <React.Fragment/>
}