import {  PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/s3.js";


const generatePreSignedUrlService = async (files) => {
    try {
        const signedUrls = await Promise.all(
            files.map(async (file) => {
               
                const command = new PutObjectCommand({
                    Bucket: "stackup-bucket",
                    Key: `uploads/${Date.now()}-${file.originalname}`,
                    ContentType: file.mimetype,
                    // ContentDisposition: 'attachment'
                })
                const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 8000 })
                return {
                    url: presignedUrl,
                    name: file.originalname,
                    size: file.size,
                    type: file.mimetype,
                }
            })
        )
        return signedUrls
    } catch (error) {
        throw new Error(`error generating preSignedUrl:${error.message}`)
    }
}

export default generatePreSignedUrlService