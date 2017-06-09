/*
* The MIT License (MIT)
*
* Product:      Paypal Basket
* Description:  A simple basket & product manager for the PayPal-node-SDK
*
* Copyright (c) 2017 Steven Agyekum <agyekum@posteo.de>
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

import { T, ERR, callbackOrPromise } from './util';
import { Paypal, Product } from './main'

/**
 * @namespace Basket
 */
export default
class Basket 
{
  /**
   * @class Basket
   * @param {Object} options | Options
   */
  constructor( options ) 
  {
    if( !options || typeof options !== T.OBJECT )
      throw ERR.PARAM_NON_OBJECT;
    if( !options.hasOwnProperty('label') )
      throw ERR.PROP_NON_LABEL;
    if( !options.hasOwnProperty('urls') )
      throw ERR.PROP_NON_URLS;

    this.options = options;
    this.products = [];
    this.total = 0.00;
  }

  /**
   * @class Basket
   * @function: add
   * @param {Object} product  | Instance of Product
   * @param {Number} amount   | Amount of product
   * @param {Function} cb     | Callback
   */
  add( product, amount, cb )
  {
    if( !product instanceof Product )
      return callbackOrPromise( cb, ERR.PARAM_NON_PRODUCT, null );
      
    if( typeof amount === T.FUNCT ) {
      cb = amount; amount = 1;
    }

    if( amount <= 0 )
      return callbackOrPromise( cb, ERR.PARAM_INV_AMOUNT, null );

    let quantity = 0;

    for( let prodidx in this.products ) {

      let prod = this.products[prodidx];

      if( prod.sku != product.sku )
        continue;

      quantity = prod.quantity += amount;
      break;
    }

    if( quantity == 0 )
      this.products.push( Object.assign(
        { quantity: amount }, product )
      );

    this.total += (parseFloat( product.price ) * amount);

    return callbackOrPromise( cb, null, null );
  }

  /**
   * @class Basket
   * @function: del
   * @param {Object} product  | Instance of Product
   * @param {Function} cb     | Callback
   */
  del( product, cb )
  {
    if( !product instanceof Product )
      return callbackOrPromise( cb, ERR.PARAM_NON_PRODUCT, null ); 

    for( let prodidx in this.products ) {

      let prod = this.products[prodidx];

      if( prod.sku != product.sku )
        continue;

      prod.quantity--;
   
      if( prod.quantity <= 0 )
        this.products.splice( prodidx, 1 );

      this.total -= parseFloat( product.price );

      break;
    }

    return callbackOrPromise( cb, null, null );
  }

  /**
   * @class Basket
   * @function: clear
   * @param {Function} cb | callback
   */
  clear( cb )
  {
    this.products.length = 0;
    this.total = 0;

    return callbackOrPromise( cb, null, null );
  }

  /**
   * @class Basket
   * @function: sell
   * @param {Object} opts | Options
   * @param {Function} cb | Callback
   */
  sell( opts, cb )
  {
    if( this.products.length == 0 )
      return callbackOrPromise( cb, ERR.BASKET_EMPTY, null );

    const currency = opts.currency || 'USD';
    const description = opts.description || '';
    const norequest = opts.norequest || false;
    const redirect = this.options.urls || {};

    var manifest = {
      intent: 'order',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: redirect,
      transactions: [{
        item_list: { items: [] }
      }]
    };

    let transactions = manifest.transactions[0];

    for( let prodidx in this.products ) {

      let prod = this.products[prodidx];

      prod.currency = currency;
 
      transactions.item_list.items.push( prod );
    }
    
    transactions.amount = { 
      currency: currency, total: this.total
    };

    transactions.description = description;

    if( !norequest ) {
      return new Promise( (done, fail) => {
        Paypal.payment.create(manifest, (err, payment) => {
          if(err) { return fail( err ); }
          manifest.payment = payment || {};
          return done( manifest );
        });
      })
      .then( pmanifest => {
        return callbackOrPromise( cb, null, pmanifest );
      })
      .catch( err => {
        return callbackOrPromise( cb, err, manifest );
      });
    }

    return callbackOrPromise( cb, null, manifest );
  }

}
