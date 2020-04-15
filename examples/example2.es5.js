/*
* The MIT License (MIT)
*
* Product:      Paypal Basket
* Description:  A simple basket & product manager for the PayPal-node-SDK
*
* Copyright (c) 2020 Notixbit Creative <info@notixbit.net>
* Copyright (c) 2017-2020 Steven Agyekum <agyekum@posteo.de>
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software
* and associated documentation files (the "Software"), to deal in the Software without restriction,
* including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
* and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies
* or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
* TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
* THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
* TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
*/

var paypal = require('paypal-rest-sdk')
  , Basket = require('@notixbit/paypal-basket').Basket
  , Product = require('@notixbit/paypal-basket').Product

/* Configure external paypal sdk */
paypal.configure({
  mode: 'sandbox',
  client_id: '',
  client_secret: ''
})

/* Some sample products */

var demoProduct1 = new Product({
  sku: 'demoproduct1',
  name: 'Demo Product 1',
  price: 15.00
})

var demoProduct2 = new Product({
  sku: 'demoproduct2',
  name: 'Demo Product 2',
  price: 6.53
})

/* Create a basket (eg. for a customer) */
var demoBasket = new Basket({
  label: 'Demo Basket',
  urls: {
    return_url: 'http://return.url',
    cancel_url: 'http://cancel.url'
  }
})


/* 
  Add our demo products
*/
demoBasket.add(demoProduct1)
demoBasket.add(demoProduct2)

/* Print current total */
console.log('Current total is: $' + demoBasket.total)

/*
  Now sell the basket (generate manifest)
  and perform actual payment request with external paypal sdk
*/

/* Promise invocation */
demoBasket.sell({ 
  currency: 'USD', norequest: true
})
.then( function(manifest) {
  paypal.payment.create(manifest, (error, payment) => {
    if(error){ throw error }

    console.log("Payment Response:")
    console.log(payment)
  })
})
.catch( function(err) { console.log(err) } )
