module.exports = {
  middleware: createMiddleware
}

function createMiddleware (reactors) {
  return function middleware (store) {
    return function onNext (next) {
      return function onAction (action) {
        console.log('middleware action', action)
        next(action)
      }
    }
  }
}
