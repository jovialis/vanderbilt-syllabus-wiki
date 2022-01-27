/**
 * Created by jovialis (Dylan Hanson) on 1/26/22.
 */

import {useRouter} from "next/router.js";

export default function
404
Page()
{
    const router = useRouter();
    router.replace('/');

    return <React.Fragment/>
}