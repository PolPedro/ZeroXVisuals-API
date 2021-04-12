/**
 * Creat link
 * 
 * @param {string} userId 
 * @param {string} productId 
 * 
 * @returns {string} signed link to download
 * 
 * @throws {UnexistenceError}
 */

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const {errors:{ UnexistenceError }}= require("zeroxvisuals-commons")
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3")
const {models:  { User }} = require("zeroxvisuals-data")
const { awsAccessKey, awsKeyId } = process.env

module.exports = (userId, productId) => {

    String.validate.notVoid(userId)
    String.validate.notVoid(productId)

    return (async () => {

        const user = await User.findById(userId).populate({path: 'productsbuy', select: 'category name'}).lean()

        if(!user) throw new UnexistenceError(`user with id: ${userId} dont exists`)

        // || check if user has the product id in productbuy ||

        const productIndex = user.productsbuy.findIndex((element)=> element._id.toString() === productId)
        
        if(productIndex != -1){
            const {category, name} = user.productsbuy[productIndex]
            const client = new S3Client({credentials: {accessKeyId: awsKeyId, secretAccessKey: awsAccessKey}, region: 'eu-central-1'})
            const command = new GetObjectCommand({Bucket: 'zeroxvisuals-packs', Key:`${category}/${name}.rar`})
            const url = await getSignedUrl(client, command, { expiresIn: 60 }) //time to expire 
            return url
        }

        throw new UnexistenceError(`product with productId: ${productId}, has not been buyed by this user`)

    })()
}