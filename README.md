
# paypal-basket

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/Burnett01/paypal-basket/master/LICENSE) [![Build Status](https://travis-ci.org/Burnett01/paypal-basket.svg?branch=master)](https://travis-ci.org/Burnett01/paypal-basket) [![npm version](https://badge.fury.io/js/paypal-basket.svg?ver=88)](https://badge.fury.io/js/paypal-basket)

<img src="http://i.imgur.com/qnXIWQ6.png" align="right"/>

A simple basket & product manager for the [PayPal-node SDK](https://github.com/paypal/PayPal-node-SDK/).

This module will assist you in managing your products and baskets, in order to craft the Paypal payment-request (JSON doc).<br>
Ultimatively it can also request the actual PayPal payment details for you.

Features:
  * Easy product & basket management
  * ES6 & ES5 support + documentation
  * Promises & classic nodeback
  * Tests

---

# Table of contents
* [API Reference](#api-reference)
  * [Basket](#basket)
  * [Product](#product)
* [Property Reference](#property-reference)
* [Function Reference](#function-reference)
  * [Creating a basket](#creating-a-basket)
  * [Creating a product](#creating-a-product)
  * [Adding products to a basket](#adding-products-to-a-basket)
  * [Deleting products from a basket](#deleting-products-from-a-basket)
  * [Empty a basket](#empty-a-basket)
  * [Selling a basket (crafting manifest / payment request)](#selling-a-basket-crafting-manifest-payment-request)
    * [Auto payment-request processing](#auto-payment-request-processing)
    * [Manual payment-request processing](#manual-payment-request-processing)
  * [Payment request-data](#payment-request-data)
* [Examples](#examples)
  * [Example 1 (Music Store) ES6](#example-1-music-store-es6)
  * [Example 2 (Manual payment-request) ES6](#example-2-manual-payment-request-es6)
* [Setup / Install](#setup-install)
* [Build](#build)
  * [Make](#make)
  * [NPM](#npm)
* [Unit-Tests](#unit-tests)
  * [Make](#make-1)
  * [NPM](#npm-1)
* [Contributing](#contributing)
* [License](#license)

---

## API Reference

### Basket:

```javascript
Basket(
    [Object {
        label: String='',
        urls: Object { 
            return_url: String='',
            cancel_url: String=''
        }
    } options]
) -> Object {
    /* Constants */
    options:  Object=options,
    products: Array=[Product, ...],
    total:    Number=0.00,

    /* Methods */
    add:  [Product, Number=amount, function(class ErrorClass err, null ok) cb] | Promise
    del:  [Product, function(class ErrorClass err, null ok) cb] | Promise
    clear:  [function(class ErrorClass err, null ok) cb] | Promise
    sell: [Object {
        currency: String='USD',
        description: String='',
        norequest: Boolean=false
    } options, function(class ErrorClass err, String manifest)] | Promise
}
```

### Product:

```javascript
Product(
    [Object {
        sku: String='',
        name: String='',
        price: Number=0.00,
        currency: String='USD',
    } options]
) -> Object {
    sku:   String=sku
    name:  String=name
    price: Number=price
    currency: String=currency
}
```

---

## Property reference:

| Property | Description |
| ------ | ----------- |
| options | An object with some options (optional) |
| label | Description of the basket (eg. Mike's basket) |
| urls | ``return_url`` = Url to return on successfull payment
|  |``cancel_url`` = Url to return on erronous payment |
| products | Array of products in the basket
| total | Current total of cash in the basket
| currency | ISO 4217 currency code
| description | Description of the payment
| norequest | Whether to perform actual payment request
| manifest | Crafted JSON document for paypal sdk
|  |``.payment`` = Actual payment request (links, id, ..) |
| sku | Stock Keeping Unit / short product name
| name | Product name
| price | Product price (float) (eg. 5.00)

---

## Function reference:

### Creating a basket

**Available options:**

| |  | Required | 
| ------ | ----------- | ------ |
| label | Description of the basket (eg. Mike's basket) | Yes |
| urls | ``return_url`` = Url to return on successfull payment | Yes |
|  |``cancel_url`` = Url to return on erronous payment |

```javascript
//=> ES6
let demoBasket = new Basket({
    label: 'My Demo Basket',
    urls: {
        return_url: 'http://return.url',
        cancel_url: 'http://cancel.url'
    }
});

//-------------------

//=> ES5
var demoBasket = new Basket({
    label: 'My Demo Basket',
    urls: {
        return_url: 'http://return.url',
        cancel_url: 'http://cancel.url'
    }
});
```

---

### Creating a product

**Available options:**

| |  | Required | 
| ------ | ----------- | ------ |
| sku | Stock Keeping Unit (eg. myawesomeproduct) | Yes |
| name | Product name (eg. My Awesome Product) | Yes |
| price | Product price (float) (eg. 5.00) | Yes |
| currency | ISO 4217 currency code (eg. USD, EUR, GBP,...) | No |

```javascript
//=> ES6
const demoProduct = new Product({
  sku: 'mydemoproduct',
  name: 'My Demo Product',
  price: 5.00
});

//-------------------

//=> ES5
var demoProduct = new Product({
  sku: 'mydemoproduct',
  name: 'My Demo Product',
  price: 5.00
});
```

---

### Adding products to a basket

```javascript
//=> ES6

/* Default invocation */
demoBasket.add( demoProduct );

/* Nodeback invocation */
demoBasket.add( demoProduct, (err, ok) => {
  if(err) { return console.log(err); }

  console.log('Product has been added!');
});

/* Promise invocation */
demoBasket.add( demoProduct )
  .then( ok => console.log('Product has been added!'); )
  .catch( err => console.log(err); );


/* Promise batch-invocation */
demoBasket.add( demoProduct )
  .then(demoBasket.add( demoProduct ))
  .then(demoBasket.add( demoProduct ));
  .then(demoBasket.add( demoProduct ));


/* Adding a specific amount */
demoBasket.add( demoProduct, 10 );


//-------------------

//=> ES5

/* Default invocation */
demoBasket.add( demoProduct );

/* Nodeback invocation */
demoBasket.add( demoProduct, function(err, ok) {
  if(err) { return console.log(err); }

  console.log('Product has been added!');
});

/* Promise invocation */
demoBasket.add( demoProduct )
  .then( function(ok) { console.log('Product has been added!'); } )
  .catch( function(err) { console.log(err); } );


/* Promise batch-invocation */
demoBasket.add( demoProduct )
  .then(demoBasket.add( demoProduct ))
  .then(demoBasket.add( demoProduct ));
  .then(demoBasket.add( demoProduct ));

/* Adding a specific amount */
demoBasket.add( demoProduct, 10 );
```

---

### Deleting products from a basket

```javascript
//=> ES6

/* Default invocation */
demoBasket.del( demoProduct );

/* Nodeback invocation */
demoBasket.del( demoProduct, (err, ok) => {
  if(err) { return console.log(err); }

  console.log('Product has been removed!');
});

/* Promise invocation */
demoBasket.del( demoProduct )
  .then( ok => console.log('Product has been removed!'); )
  .catch( err => console.log(err); );


/* Promise batch-invocation */
demoBasket.del( demoProduct )
  .then(demoBasket.del( demoProduct ))
  .then(demoBasket.del( demoProduct ));
  .then(demoBasket.del( demoProduct ));

//-------------------

//=> ES5

/* Default invocation */
demoBasket.del( demoProduct );

/* Nodeback invocation */
demoBasket.del( demoProduct, function(err, ok) {
  if(err) { return console.log(err); }

  console.log('Product has been removed!');
});

/* Promised based invocation */
demoBasket.del( demoProduct )
  .then( function(ok) { console.log('Product has been removed!'); } )
  .catch( function(err) { console.log(err); } );


/* Promise batch-invocation */
demoBasket.del( demoProduct )
  .then(demoBasket.del( demoProduct ))
  .then(demoBasket.del( demoProduct ));
  .then(demoBasket.del( demoProduct ));
```

---

### Empty a basket

```javascript
//=> ES6

/* Default invocation */
demoBasket.clear();

/* Nodeback invocation */
demoBasket.clear( (err, ok) => {
  if(err) { return console.log(err); }

  console.log('Basket has been cleared!');
});

/* Promise invocation */
demoBasket.clear()
  .then( ok => console.log('Basket has been cleared!'); )
  .catch( err => console.log(err); );

//-------------------

//=> ES5

/* Default invocation */
demoBasket.clear());

/* Nodeback invocation */
demoBasket.clear( function(err, ok) {
  if(err) { return console.log(err); }

  console.log('Basket has been cleared!');
});

/* Promised based invocation */
demoBasket.clear()
  .then( function(ok) { console.log('Basket has been cleared!'); } )
  .catch( function(err) { console.log(err); } );
```

---

### Selling a basket (crafting manifest / payment request)

**Available options:**

| |  | Required | 
| ------ | ----------- | ------ |
| currency | ISO 4217 currency code (eg. USD, EUR, GBP,...) | No |
| description | Describe the payment (eg. Mike's payment) | No |
| norequest | Enable/Disable payment-request processing by paypal-basket. | No |
| | If this option is set to ``true``, paypal-basket **will not** perform the actual payment-request.<br>In addition, the ``.payment`` property of the manifest won't be available.<br>If this option is set to ``false``, paypal-basket **will** perform the actual payment-request,<br>and the ``.payment`` property of the manifest will be available. |

#### Auto payment-request processing:

```javascript
//=> ES6

/* -> Nodeback invocation */
demoBasket.sell( { 'currency': 'USD' }, (err, manifest) => {
  if( err ) { return console.log(err) }

  // Payment request has been performed and you can access
  // the data (links, timestamp, etc) by using manifest.payment

  console.log("Payment ID: " + manifest.payment.id);
  console.log("Payment created: " + manifest.payment.create_time);
  console.log("Payment URL: " + manifest.payment.links[1].href);
});

/* -> Promise invocation */
demoBasket.sell( { 'currency': 'USD' } )
.then( manifest => {
  // Payment request has been performed and you can access
  // the data (links, timestamp, etc) by using manifest.payment

  console.log("Payment ID: " + manifest.payment.id);
  console.log("Payment created: " + manifest.payment.create_time);
  console.log("Payment URL: " + manifest.payment.links[1].href);
})
.catch( err => console.log(err));

//-------------------

//=> ES5

/* -> Nodeback invocation */
demoBasket.sell( { 'currency': 'USD' }, function(err, manifest) {
  if( err ) { return console.log(err); }

  // Payment request has been performed and you can access
  // the data (links, timestamp, etc) by using manifest.payment

  console.log("Payment ID: " + manifest.payment.id);
  console.log("Payment created: " + manifest.payment.create_time);
  console.log("Payment URL: " + manifest.payment.links[1].href);
});

/* -> Promise invocation */
demoBasket.sell( { 'currency': 'USD' } )
.then( function(manifest) {
  // Payment request has been performed and you can access
  // the data (links, timestamp, etc) by using manifest.payment

  console.log("Payment ID: " + manifest.payment.id);
  console.log("Payment created: " + manifest.payment.create_time);
  console.log("Payment URL: " + manifest.payment.links[1].href);
})
.catch( function(err) { console.log(err); } );
```

#### Manual payment-request processing:

```javascript
//=> ES6

/* -> Nodeback invocation */
demoBasket.sell({ currency: 'USD', 'norequest': true },
(err, manifest) => {
  if( err ) { return console.log(err); }

  // Payment request has not been performed and you can use
  // the manifest to perform it yourself

  paypal.payment.create(manifest, (error, payment) => {
    if( error ){ throw error; }

    console.log("Payment ID: " + payment.id);
    console.log("Payment created: " + payment.create_time);
    console.log("Payment URL: " + payment.links[1].href);
  });

});

/* -> Promise invocation */
demoBasket.sell( { 'currency': 'USD', 'norequest': true } )
.then( manifest => {
  // Payment request has not been performed and you can use
  // the manifest to perform it yourself

  paypal.payment.create(manifest, (error, payment) => {
    if( error ){ throw error; }

    console.log("Payment ID: " + payment.id);
    console.log("Payment created: " + payment.create_time);
    console.log("Payment URL: " + payment.links[1].href);
  });

})
.catch( err => console.log(err));

//-------------------

//=> ES5

/* -> Nodeback invocation */
demoBasket.sell({ currency: 'USD', 'norequest': true },
function(err, manifest) {
  if( err ) { return console.log(err); }

  // Payment request has not been performed and you can use
  // the manifest to perform it yourself

  paypal.payment.create(manifest, function(error, payment) {
    if( error ){ throw error; }

    console.log("Payment ID: " + payment.id);
    console.log("Payment created: " + payment.create_time);
    console.log("Payment URL: " + payment.links[1].href);
  });

});

/* -> Promise invocation */
demoBasket.sell( { 'currency': 'USD', 'norequest': true } )
.then( function(manifest) {
  // Payment request has not been performed and you can use
  // the manifest to perform it yourself

  paypal.payment.create(manifest, function(error, payment) {
    if( error ){ throw error; }

    console.log("Payment ID: " + payment.id);
    console.log("Payment created: " + payment.create_time);
    console.log("Payment URL: " + payment.links[1].href);
  });

})
.catch( function(err) { console.log(err); } );
```

---

### Payment request-data:

<img src="http://i.imgur.com/g50sduz.png" />


---

## Examples

Check out the ['examples' folder for ES5 + ES6 samples](../master/examples)

### Example 1 (Music Store) ES6
In this example paypal-basket will craft the manifest and request the actual payment by using the internal Paypal-SDK.

```javascript
import paypal from 'paypal-rest-sdk';
import { Basket, Product } from 'paypal-basket'

/* Configure paypal sdk */
paypal.configure({
  mode: 'sandbox',
  client_id: '',
  client_secret: ''
});

/* A JSON collection of music albums */
let albums = [
  {
    "sku": "davidguettalisten",
    "name": "David Guetta - Listen",
    "price": "5.00"
  },
  {
    "sku": "michaeljacksonworld",
    "name": "Michael Jackson - World",
    "price": "10.00"
  },
  {
    "sku": "simplyredthrillme",
    "name": "Simply Red - Thrill me",
    "price": "10.00"
  }
];

/* 
  A collection of music products
  to contain the actual album products
*/
let products = {};

/* 
  Create products from albums 
  and push to collection
*/
for( let index in albums ) {
  let album = albums[index];
  products[album.sku] = new Product(album);
}

/* 
  At this point you can access a product like:

  products['michaeljacksonworld']
  products['davidguettalisten']
*/

/* Create a basket (eg. for a customer) */
let sessionxyzBasket = new Basket({
  label: 'Basket of session xyz',
  urls: {
    return_url: 'http://return.url',
    cancel_url: 'http://cancel.url'
  }
});


/* 
  Now let the customer add/del 
  some products to/from their basket.
  Presumably via website
*/
sessionxyzBasket.add(products['davidguettalisten'])
.then(sessionxyzBasket.add(products['michaeljacksonworld']))
.then(sessionxyzBasket.add(products['simplyredthrillme']))
.then(sessionxyzBasket.del(products['davidguettalisten']));

/* Print current total */
console.log('Current total is: $' + sessionxyzBasket.total);

/*
  Now sell the basket (generate manifest)
  and request actual payment details
*/

/* Promise invocation */
sessionxyzBasket.sell( { 'currency': 'USD' } )
.then( manifest => {
  console.log("Payment Response:");
  console.log(manifest.payment);
})
.catch( err => console.log(err));

/* Nodeback invocation */
sessionxyzBasket.sell( { 'currency': 'USD' }, (err, manifest) => {
  if( err ) { return console.log(err) }

  console.log("Payment Response:");
  console.log(manifest.payment);
});
```

### Example 2 (Manual payment-request) ES6

In this example paypal-basket will craft the payment manifest,
but it won't perform the actual payment request.
<br>Just perform the request yourself.

Make sure ```norequest``` is *true*.

```javascript
import paypal from 'paypal-rest-sdk';
import { Basket, Product } from 'paypal-basket';

/* Configure external paypal sdk */
paypal.configure({
  mode: 'sandbox',
  client_id: '',
  client_secret: ''
});

/* Some sample products */

let demoProduct1 = new Product({
  sku: 'demoproduct1',
  name: 'Demo Product 1',
  price: 15.00
});

let demoProduct2 = new Product({
  sku: 'demoproduct2',
  name: 'Demo Product 2',
  price: 6.53
});

/* Create a basket (eg. for a customer) */
let demoBasket = new Basket({
  label: 'Demo Basket',
  urls: {
    return_url: 'http://return.url',
    cancel_url: 'http://cancel.url'
  }
});


/* 
  Add our demo products
*/
demoBasket.add(demoProduct1);
demoBasket.add(demoProduct2);

/* Print current total */
console.log('Current total is: $' + demoBasket.total);

/*
  Now sell the basket (generate manifest)
  and perform actual payment request with external paypal sdk
*/

/* Promise invocation */
demoBasket.sell({ 
  currency: 'USD', norequest: true
})
.then( manifest => {
  paypal.payment.create(manifest, (error, payment) => {
    if(error){ throw error; }

    console.log("Payment Response:");
    console.log(payment);
  });
})
.catch( err => console.log(err));
```

---

## Setup / Install

Use `npm install paypal-rest-sdk`

Use `npm install paypal-basket` 

```javascript
//=> ES6
import paypal from 'paypal-rest-sdk';
import { Basket, Product } from 'paypal-basket';

/*
  Configure paypal SDK
  Grab your developer details here:
  https://developer.paypal.com/
*/
paypal.configure({
  mode: 'sandbox',
  client_id: '',
  client_secret: ''
});

/* Now check examples above */

//-------------------

//=> ES5
var paypal = require('paypal-rest-sdk')
  , Basket = require('paypal-basket').Basket
  , Product = require('paypal-basket').Product;

/*
  Configure paypal SDK
  Grab your developer details here:
  https://developer.paypal.com/
*/
paypal.configure({
  mode: 'sandbox',
  client_id: '',
  client_secret: ''
});

/* Now check examples above */
```

---

## Build

### Make

```make build```

### NPM

```npm run build```

---

## Unit-Tests

The testing-framework used by this module is [Mocha](https://github.com/mochajs/mocha) with the BDD / TDD assertion library [Chai](https://github.com/chaijs/chai).

Various tests are performed to make sure this module runs as smoothly as possible.

* test/test.default.js `Performs 4 tests` | [Source](../master/test/test.default.js)

Output using [Mocha](https://github.com/mochajs/mocha) `spec` reporter:   

<img src="http://i.imgur.com/Up5GIM9.png" />

Default reporter: `list`

### Make

```make test```

### NPM

```npm test```

---

## Contributing

You're very welcome and free to contribute. Thank you.

---

## License

[MIT](../master/LICENSE.MD)
