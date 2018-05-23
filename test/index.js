const test = require('ava')
const { createStore, applyMiddleware } = require('redux')
const reduxStateReactor = require('../')

const { middleware: stateReactorMiddleware } = reduxStateReactor

test('redux-state-reactor', function (t) {
  t.truthy(reduxStateReactor, 'module is require-able')
  t.is(typeof stateReactorMiddleware, 'function', 'middleware is function')
})

test('runs reactors after every action', function (t) {
  const calls = 3

  const ACTION = { type: 'test' }
  const STATE = {}
  var called = 0

  const reducer = (state = STATE, action) => state

  const reactor = state => {
    t.is(state, STATE)
    called++
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
  
  for (var i = 0; i < calls; i++) {
    store.dispatch(ACTION)
  }

  t.is(called, calls)
})

// test('reactor can dispatch from initial state', function (t) {

test('reactor can return action', function (t) {
  const ACTION_ONE = { type: 'one' }
  const ACTION_TWO = { type: 'two' }
  const STATE_ONE = {}
  const STATE_TWO = {}
  const STATE_THREE = {}

  var called = 0

  const reducer = (state = STATE_ONE, action) => {
    if (action === ACTION_ONE) return STATE_TWO
    if (action === ACTION_TWO) return STATE_THREE
    return state
  }

  const reactor = state => {
    called++
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
  t.is(called, 3) // once for each state
})

// test('race condition')
//
// - reactor1 emits action, changes state before reactor2 runs
