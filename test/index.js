const test = require('ava')

const reduxStateReactor = require('../')

test('redux-state-reactor', function (t) {
  t.truthy(reduxStateReactor, 'module is require-able')
})
