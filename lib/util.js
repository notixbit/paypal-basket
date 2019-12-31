/*
* The MIT License (MIT)
*
* Product:      Paypal Basket
* Description:  A simple basket & product manager for the PayPal-node-SDK
*
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

export const T = {
    OBJECT: 'object'
  , STRING: 'string'
  , NUMBER: 'number'
  , FUNCT:  'function'
};

export const ERR = {
    PARAM_NON_PRODUCT:  new Error('Argument is not an instance of Product!')
  , PARAM_NON_OBJECT:   new Error('The first parameter must be an object!')
  , PARAM_INV_AMOUNT:   new Error('The amount is invalid!')
  , PROP_NON_LABEL:     new Error('.label property is required!')
  , PROP_NON_URLS:      new Error('.urls property is required!')
  , PROP_NON_SKU:       new Error('.sku property is required!')
  , PROP_NON_NAME:      new Error('.name property is required!')
  , PROP_NON_PRICE:     new Error('.price property is required!')
  , PROP_INV_PRICE:     new Error('.price value cannot be 0!')
  , BASKET_EMPTY:       new Error('The basket is empty!')
};

export const callbackOrPromise = ( cb, err, val ) => {
  let prom = ( err ) ?
    Promise.reject( err ) : Promise.resolve( val );
  return ( cb ) ? cb( err, val ) : prom;
}
