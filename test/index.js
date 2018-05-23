const test = require('ava')
const { createStore, applyMiddleware } = require('redux')
const reduxStateReactor = require('../')

const { middleware: stateReactorMiddleware } = reduxStateReactor

test('redux-state-reactor', function (t) {
  t.truthy(reduxStateReactor, 'module is require-able')
  t.is(typeof stateReactorMiddleware, 'function', 'middleware is function')
})

test('runs reactors after every action', function (t) {
  const ACTION = { type: 'test' }

  const reducer = (state = {}, action) => {
    if (action === ACTION) return { test: true }
    return state
  }

  const reactor = state => {
    console.log('reactor', state)
    if (!state.test) return ACTION
    return false
  }

  const stateReactors = [
    reactor
  ]

  const store = createStore(
    reducer,
    applyMiddleware(
      stateReactorMiddleware(stateReactors)
    )
  )

  var state = store.getState()
  console.log('before state', state)

  store.dispatch(ACTION)

  state = store.getState()
  console.log('after state', state)
})

// test('race condition')
//
// - reactor1 emits action, changes state before reactor2 runs
