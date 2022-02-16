
const paystack = (request) => {
  const mySecretKey = process.env.MYSECRETKEY;

  const initializePayment = (form, mycallback) =>{
    const options = {
      url: 'https://api.paystack.co/transaction/initialize',
      headers: {
      "Authorization": "Bearer sk_test_760af0739931b4a3af98ea3069dbd294e5a27987",
        // "Authorization":"Bearer [mySecretKey]",
        "content-type":'ápplication/json',
        'cache-control': 'non-cache' 
      },
      form
    }
    const callback = (error, response, body) =>{
      return mycallback(error, body)
    }
    request.post(options, callback)
  }

  const verifyPayment = async(ref, mycallback) => {
    const options = {
      url : 'https://api.paystack.co/transaction/verify/:reference',
      headers : {
        "Authorization": "Bearer sk_test_760af0739931b4a3af98ea3069dbd294e5a27987",
        // authorization: mySecretKey,
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      }
    }
    const callback = (error, response, body)=>{
      return mycallback(error, body);
    }
    request(options, callback);
  }

  return {initializePayment, verifyPayment}
}

module.exports = paystack