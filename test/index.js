const test = require('ava')
const { createStore, applyMiddleware } = require('redux')
const reduxStateReactor = require('../')

const { middleware: stateReactorMiddleware } = reduxStateReactor

test('redux-state-reactor', function (t) {
  t.truthy(reduxStateReactor, 'module is require-able')
  t.is(typeof stateReactorMiddleware, 'function', 'middleware is function')
})

test('reactor is not called with initial state', function (t) {
  const expectedCalls = 0
  const STATE = {}

  var calls = 0

  const reducer = (state = STATE, action) => state

  const reactor = state => {
    t.is(state, STATE)
    calls++
    return false
  }

  const stateReactors = [reactor]
  const store = createStore(
    reducer,
    applyMiddleware(
      stateReactorMiddleware(stateReactors)
    )
  )

  t.is(calls, expectedCalls)
})

test('reactor runs after every action', function (t) {
  const actionDispatches = 3
  const expectedCalls = actionDispatches

  const ACTION = { type: 'test' }
  const STATE = {}

  var calls = 0

  const reducer = (state = STATE, action) => state

  const reactor = state => {
    t.is(state, STATE)
    calls++
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
  
  for (var i = 0; i < actionDispatches; i++) {
    store.dispatch(ACTION)
  }

  t.is(calls, expectedCalls)
})

test('reactor can return action', function (t) {
  const expectedCalls = 2 // once for each next state

  const ACTION_ONE = { type: 'one' }
  const ACTION_TWO = { type: 'two' }
  const STATE_ONE = {}
  const STATE_TWO = {}
  const STATE_THREE = {}

  var calls = 0

  const reducer = (state = STATE_ONE, action) => {
    if (action === ACTION_ONE) return STATE_TWO
    if (action === ACTION_TWO) return STATE_THREE
    return state
  }

  const reactor = state => {
    calls++
    if (state === STATE_TWO) return ACTION_TWO
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

  store.dispatch(ACTION_ONE)

  const state = store.getState()
  t.is(state, STATE_THREE)
  t.is(calls, expectedCalls) // once for each state
})

// test('race condition')
//
// - reactor1 emits action, changes state before reactor2 runs
