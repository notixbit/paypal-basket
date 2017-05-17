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

import { expect } from 'chai';
import { Basket, Product } from '../lib/main'

let basket = undefined;
let product = undefined;

describe('Paypal Basket [TEST]', () => {

  it('creates a basket', done => {

    basket = new Basket( {
      "label": "Demo Basket",
      "urls": {}
    });

    expect(basket).to.be.a('object');

    expect(basket).to.have.property('options');
    expect(basket).to.have.property('products');
    expect(basket).to.have.property('total');

    expect(basket).to.have.property('add');
    expect(basket).to.have.property('del');
    expect(basket).to.have.property('sell');

    expect(basket.add).to.be.a('function');
    expect(basket.del).to.be.a('function');
    expect(basket.sell).to.be.a('function');

    done();
  });

  it('creates a product', done => {

    const sku = 'demoproduct';
    const name = 'Demo Product';

    product = new Product({
      'sku': sku,
      'name': name,
      'price': '5.00'
    });

    expect(product).to.be.a('object');
    expect(product).to.have.property('sku');
    expect(product).to.have.property('name');
    expect(product).to.have.property('price');
    expect(product).to.have.property('currency');

    done();
  });

  it('adds the product to the basket', done => {

    basket.add( product, (err, ok) => {

      expect(err).to.be.null;
      expect(basket.products).to.be.a('array');
      expect(basket.products[0].sku).to.equal(product.sku);
      expect(basket.products[0].name).to.equal(product.name);
      expect(basket.products[0].price).to.equal(product.price);
      expect(basket.products[0].currency).to.equal('USD');
      expect(basket.products[0].quantity).to.equal(1);
      expect(basket.total).to.equal(5.00);

      done();

    });
    
  });

  it('deletes the product from the basket', done => {

    basket.del( product, (err, ok) => {

      expect(err).to.be.null;
      expect(basket.products).to.be.empty;
      expect(basket.total).to.equal(0.00);

      done();

    });
    
  });

  it('adds the product 10x to the basket', done => {

    basket.add( product, 10, (err, ok) => {

      expect(err).to.be.null;
      expect(basket.products).to.be.a('array');
      expect(basket.products[0].sku).to.equal(product.sku);
      expect(basket.products[0].name).to.equal(product.name);
      expect(basket.products[0].price).to.equal(product.price);
      expect(basket.products[0].currency).to.equal('USD');
      expect(basket.products[0].quantity).to.equal(10);
      expect(basket.total).to.equal(50.00);
    
      done();

    });
    
  });

});