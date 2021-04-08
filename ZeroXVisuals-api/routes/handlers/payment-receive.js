const { handleError } = require('../../helpers')
const {paymentRecieve} = require('zeroxvisuals-server-logic')

module.exports = (req, res) => {
    
    const stripe = require('stripe')(process.env.key)
    const endpointSecret = (process.env.endSecret)

    const payload = req.body;
    const sig = req.headers['stripe-signature'];
  
    let event;

    // || security check webhook is coming from stripe ||
  
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Stripe validation error`);
    }

    // || call server logic payment receive ||

    if(event.type === 'checkout.session.completed'){
        try {
            paymentRecieve(event)
                .then(() => res.status(200).send())
                .catch(error => handleError(error, res))
        } catch (error) {
            handleError(error, res)
        }
    }else{
        res.status(200).send()
    }
}