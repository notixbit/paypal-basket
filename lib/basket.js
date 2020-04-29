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

const { T, ERR, callbackOrPromise } = require('./util')
const Paypal = require('paypal-rest-sdk')
const Product = require('./product')

/**
 * @namespace Basket
 */
module.exports =
  class Basket {
    /**
     * @class Basket
     * @param {object} options
     */
    constructor(options) {
      if (!options || typeof options !== T.OBJECT)
        throw ERR.PARAM_NON_OBJECT
      if (!options.hasOwnProperty('label'))
        throw ERR.PROP_NON_LABEL
      if (!options.hasOwnProperty('urls'))
        throw ERR.PROP_NON_URLS

      this.options = options
      this.products = []
      this.total = 0.00
    }

    /**
     * Adds products to the basket.
     * @param {Product} product
     * @param {Number} amount
     * @param {Function|any} cb
     */
    add(product, amount = 1, cb = undefined) {
      if (!(product instanceof Product))
        return callbackOrPromise(cb, ERR.PARAM_NON_PRODUCT, null)

      if (!amount || typeof amount === T.FUNCT) {
        cb = amount; amount = 1
      }

      if (amount <= 0)
        return callbackOrPromise(cb, ERR.PARAM_INV_AMOUNT, null)

      let quantity = 0

      for (const prodidx in this.products) {
        const prod = this.products[prodidx]

        if (prod.sku != product.sku)
          continue

        quantity = prod.quantity += amount
        break
      }

      if (quantity == 0)
        this.products.push(Object.assign(
          { quantity: amount }, product)
        )

      this.total += (parseFloat(product.price) * amount)

      return callbackOrPromise(cb, null, null)
    }

    /**
     * Deletes a product from the basket.
     * @param {Product} product
     * @param {Function|any} cb
     */
    del(product, cb = undefined) {
      if (!(product instanceof Product))
        return callbackOrPromise(cb, ERR.PARAM_NON_PRODUCT, null)

      for (const prodidx in this.products) {
        const prod = this.products[prodidx]

        if (prod.sku != product.sku)
          continue

        prod.quantity--

        if (prod.quantity <= 0)
          this.products.splice(prodidx, 1)

        this.total -= parseFloat(product.price)

        break
      }

      return callbackOrPromise(cb, null, null)
    }

    /**
     * Deletes all products from a basket.
     * @param {Function|any} cb
     */
    clear(cb = undefined) {
      this.products.length = 0
      this.total = 0
      return callbackOrPromise(cb, null, null)
    }

    /**
     * Requests the paypal-payment manifest.
     * @param {Object} opts
     * @param {Function|any} cb
     */
    sell(opts, cb = undefined) {
      if (this.products.length == 0)
        return callbackOrPromise(cb, ERR.BASKET_EMPTY, null)

      const currency = opts.currency || 'USD'
      const description = opts.description || ''
      const norequest = opts.norequest || false
      const redirect = this.options.urls || {}

      const manifest = {
        intent: 'order',
        payer: {
          payment_method: 'paypal'
        },
        redirect_urls: redirect,
        transactions: [{
          item_list: { items: [] }
        }]
      }

      const transactions = manifest.transactions[0]

      for (const prodidx in this.products) {
        const prod = this.products[prodidx]
        prod.currency = currency
        transactions.item_list.items.push(prod)
      }

      transactions.amount = {
        currency: currency, total: this.total
      }

      transactions.description = description

      if (!norequest) {
        return new Promise((done, fail) => {
          Paypal.payment.create(manifest, (err, payment) => {
            if (err) { return fail(err) }
            manifest.payment = payment || {}
            return done(manifest)
          })
        })
          .then(pmanifest => {
            return callbackOrPromise(cb, null, pmanifest)
          })
          .catch(err => {
            return callbackOrPromise(cb, err, manifest)
          })
      }

      return callbackOrPromise(cb, null, manifest)
    }

  }
