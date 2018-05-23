module.exports = {
  middleware: createMiddleware
}

// https://redux.js.org/advanced/middleware
function createMiddleware (reactors) {
  return function middleware (store) {
    return function onNext (next) {
      return function onAction (action) {
        // dispatch incoming action
        next(action)

        // open question:
        //     get state once for all reactors
        // OR  get state for each reactor
        // ?

        // apply all reactors
        reactors.forEach(applyReactor(store))
      }
    }
  }
}

function applyReactor (store) {
  return function (reactor) {
    // get current state
    const state = store.getState()

    // get reaction from current state
    const reaction = reactor(state)

    // if no reaction
    if (reaction == null || reaction == false) return

    // otherwise dispatch (re)action
    store.dispatch(reaction)
  }
}
