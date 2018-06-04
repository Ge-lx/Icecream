/**
 * @param {Function} endpointHandlerFunction
 * @returns {Function}
 */
function asyncMiddleware (endpointHandlerFunction) {
  return (req, res, next) => {
    Promise.resolve(endpointHandlerFunction(req, res, next))
      .catch(next)
  }
}

module.exports = asyncMiddleware
