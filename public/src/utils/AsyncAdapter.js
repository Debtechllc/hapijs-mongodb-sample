'use strict';

/**
 * @module utils/AsyncAdapter
 */

/**
 * Wraps the context methods, names of which are enlisted in asyncInterface, in methodName = { async: [Function] } form making them understandeable for hapi-async-handler plugin. It is implicitly assumed that all enlisted methods are declared in the context as async, or, at least, return a thenable.
 * @param {string[]} asyncInterface - A list of names of context methods to be wrapped.
 * @returns {Object} A collection of method wrappers understandeable for hapi-async-handler.
 */
module.exports = function AsyncAdapter(asyncInterface) {

  const adapter = {};
  //console.dir(asyncInterface)
  asyncInterface.forEach((method) => {
    
    adapter[method] = this[method].bind(this);
  });

  return adapter;
};
