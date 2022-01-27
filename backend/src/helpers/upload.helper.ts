/**
 * Created by jovialis (Dylan Hanson) on 1/25/22.
 */

import {S3} from "aws-sdk";

const s3 = new S3({
    accessKeyId: "AKIAT6DX7YSMJIF6CHQR",
    secretAccessKey: "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"
});

export default function uploadFile() {
    const params = {
        Bucket: '',
        Key: 'cat.png',
        Body: 'content'
    };
}