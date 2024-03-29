require('zeroxvisuals-commons/polyfills/string')
const{ errors: { DuplicityError } } = require('zeroxvisuals-commons')
const { models: { Product, Rate } } = require('zeroxvisuals-data')
const { ObjectId } = require('zeroxvisuals-data/mongoose');

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


module.exports = () => {

    const categroy = ['baners', 'overlays', 'cams', 'packs']

    return (async () => {
        for (var i = 0; i < 10; i++){
            const product = await Product.create({ 
                name: makeid(5),
                description: makeid(20),
                category: categroy[Math.floor(Math.random() * 4)],
                price: Math.floor(Math.random() * 100),
                image: "https://zeroxvisuals/images/" + makeid(7),
                link: "https://zeroxvisuals/products/" + makeid(7)

            })
            // product.rates.unshift(
            //     new Rate ({
            //         userId: ObjectId("6043f6db122f522aa48a2e8e"),
            //         stars:  Math.floor(Math.random() * 5),
            //         date: new Date,
            //         message: makeid(15)
            //     })
            // )
            product.save()
        }
    })()
}