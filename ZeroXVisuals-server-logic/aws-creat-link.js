/**
 * Creat link
 * 
 * @returns {string} signed link to download
 */


const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3")


// const AWS = require('aws-sdk')

module.exports = () => {

    // String.validate.notVoid(userId)
    // String.validate.notVoid(productId)

    // AWS.config.update({
    //     region:'eu-central-1',
    //     accessKeyId,
    //     secretAccessKey
    // })

    return (async () => {
        //TODO que le llege tanto el product id y el userid para comprovar que efectivamente lo tiene comprado

        
        const client = new S3Client({credentials: {accessKeyId: 'AKIAUGRNFQ2XDPTPNQVP', secretAccessKey: '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'}, region: 'eu-central-1'})
        const command = new GetObjectCommand({Bucket: 'zeroxvisuals-packs', Key:'packs/VID_20190330_130907.rar'})
        const url = await getSignedUrl(client, command, { expiresIn: 60 })
        return url
        


    })()
}