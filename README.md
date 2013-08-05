# firebase-react

Use [Firebase](http://firebase.com/) with [reactive](https://github.com/component/reactive) templates.

Emits `change` and `change <attr>` events whenever a child of the given Firebase location is changed/added/removed.

Emits a `ready` event when the location emits its initial `value` event.

## Example

```js
var react = require('firebase-react')
  , reactive = require('reactive')

var el = document.getElementById('view')
  , db = new Firebase('some.firebaseio.com/wherever')

reactive(el, react(db))
```

## API

### react(firebase)

Returns instance of `React` all wired up to listen to `firebase`.

### react.use(fn)

Plugin support: passes `React` constructor to `fn`. Chainable.

### React#ref()

Returns the Firebase instance.

### React#attr(name, [options])

Declare an attribute. Use this to generate a getter/setter method `name`. 
firebase-react should generate these automatically, so you don't need to 
use this unless you want to wire up client-side validations, etc. for your attrs.

### React#ATTR()

Attribute getter. Returns the last-known value of the child ATTR.

### React#ATTR(val)

Attribute setter. Sets the child ATTR to `val`.

### React#attrs

Map of declared attributes and their options.
