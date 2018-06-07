module.exports = {
  middleware: createMiddleware
}

// https://github.com/HenrikJoreteg/redux-bundler/blob/master/src/utils.js
const HAS_WINDOW = typeof window !== 'undefined'
const IS_BROWSER = HAS_WINDOW || typeof self !== 'undefined'
const fallback = func => { setTimeout(func, 0) }
const raf = IS_BROWSER && self.requestAnimationFrame ? self.requestAnimationFrame : fallback
const ric = IS_BROWSER && self.requestIdleCallback ? self.requestIdleCallback : fallback

// https://redux.js.org/advanced/middleware
function createMiddleware (reactors) {
  var nextReaction = null

  return function middleware (store) {
    return function onNext (next) {
      return function onAction (action) {
        // dispatch incoming action
        next(action)

        // one reaction at a time
        if (nextReaction) return

        // we only need to apply one reaction at a time,
        // because each reaction will dispatch a new action
        // and re-trigger the middleware.
        nextReaction = getNextReaction(store, reactors)

        if (nextReaction) {
          // let browser chill
          // ric(() => {
            const toDispatch = nextReaction
            nextReaction = null
            store.dispatch(toDispatch)
          // })
        }
      }
    }
  }
}

function getNextReaction (store, reactors) {
  // get current state
  const state = store.getState()
  // get first reactor which returns something truthy
  for (var i = 0; i < reactors.length; i++) {
    const reactor = reactors[i]
    const reaction = reactor(state)
    if (reaction && isObject(reaction)) return reaction
  }
}

function isObject (value) {
  return typeof value === 'object'
}
