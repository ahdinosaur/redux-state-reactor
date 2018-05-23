# redux-state-reactor

[redux middleware](https://redux.js.org/advanced/middleware) to react to state and dispatch actions

```shell
npm install --save redux-state-reactor
```

## background

reactors are similar to [`reselect`](https://github.com/reactjs/reselect) selectors,

they receive the state and return either an action or false.

the concept has been lifted from [`redux-bundler`'s `bundle.reactX`](https://reduxbundler.com/api/bundle.html#bundlereactx).

## example

```js
const { createStore, applyMiddleware } = require('redux')
const { middleware: stateReactorMiddleware } = require('redux-state-reactor')

const actions = require('./actions')

const reducer = (state = {}, action) => {
  if (action.type === 'AUTHENTICATE_START') {
    return Object.assign(state, { isAuthenticating: true })
  } else if (action.type === 'AUTHENTICATE_COMPLETE') {
    return Object.assign(state, { isAuthenticating: false, isAuthenticated: true })
  }
  /* ... */
}

const authenticationReactor = state => {
  if (state.isAuthenticated) return false
  if (state.isAuthenticating) return false // to avoid reactor cycle
  return actions.authenticate()
}

const stateReactors = [
  authenticateReactor
]

const store = createStore(
  reducer,
  applyMiddleware(
    stateReactorMiddleware(reactors)
  )
)

// with empty state, will automatically start authenticating!
```

## usage

### `{ middleware } = require('redux-state-reactor')`

## license

The Apache License

Copyright &copy; 2018 Michael Williams

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
