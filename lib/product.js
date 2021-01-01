/*
* The MIT License (MIT)
*
* Product:      Paypal Basket
* Description:  A simple basket & product manager for the PayPal-node-SDK
*
* Copyright (c) 2020-2021 Notixbit Creative <info@notixbit.net>
* Copyright (c) 2017-2021 Steven Agyekum <agyekum@posteo.de>
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

const { T, ERR } = require('./util')

/**
 * @namespace Product
 */
module.exports =
class Product 
{
  /**
   * @class Product
   * @param {Object} options | Options
   */
  constructor( options )
  {
    if( !options || typeof options !== T.OBJECT )
      throw ERR.PARAM_NON_OBJECT
    if( !options.hasOwnProperty('sku') )
      throw ERR.PROP_NON_SKU
    if( !options.hasOwnProperty('name') )
      throw ERR.PROP_NON_NAME
    if( !options.hasOwnProperty('price') )
      throw ERR.PROP_NON_PRICE
    if( parseFloat(options.price) == 0 )
      throw ERR.PROP_INV_PRICE

    this.sku  = options.sku
    this.name = options.name
    this.price = options.price
    this.currency = options.currency || 'USD'
  }
}
