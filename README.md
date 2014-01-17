# firebase-react

Use [Firebase](http://firebase.com/) with 
[reactive](https://github.com/component/reactive) templates.

Emits `change` and `change <attr>` events whenever a child of the given 
Firebase location is changed/added/removed.

Emits a `ready` event when the location emits its initial `value` event.

## Installation

With [component](https://github.com/component/component):

```
$ component install lvivier/firebase-react
```

## Usage

```js
var react = require('firebase-react')
var reactive = require('reactive')

var el = document.getElementById('template')
var db = new Firebase('some.firebaseio.com/wherever')

reactive(el, react(db))
```

## API

### React(firebase)

Returns instance of `React` all wired up to listen to `firebase`.

### React.use(fn)

Plugin support: passes `React` constructor to `fn`. Chainable.

### React#remove(fn)

Removes all values at the location.

### React#set(obj[, fn])

Replaces all values with `obj`.

### React#exists(fn)

Calls back with a boolean, whether the location has any values.

### React#ref()

Returns the Firebase instance.

### React#id()

Returns the name. Same as `react.ref().name()`.

### React#attr(name, [options])

Declare an attribute. Use this to generate an accessor method `name`.
`firebase-react` should generate these automatically, so you don't need to 
use this unless you want to wire up client-side validations, etc. for your attrs.

### React#ATTR()

Attribute getter. Returns the last-known value of the child ATTR.

### React#ATTR(val)

Attribute setter. Sets the child ATTR to `val`.

### React#attrs

Map of declared attributes and their options.

## License

(The MIT License)

Copyright (c) 2013 Luke Vivier <luke@vivier.ca>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
