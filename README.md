# firebase-react

Use [Firebase](http://firebase.com/) with [reactive](https://github.com/component/reactive) templates.

## Example

```js
var react = require('firebase-react')
var reactive = require('reactive')

var el = document.getElementById('view')
var db = react(new Firebase('some.firebaseio.com/wherever'))

reactive(el, db)
```

## API

### react(firebase)

Augments `firebase` (an instance of Firebase) with reactive superpowers.

### .on(event, callback)

Now with support for `change` and `change <name>` events.

### .emit(event, [data, [data]])

Emit `change`-type events to subscribers.

### .attr(name, [options])

Declare an attribute. Use this to generate a getter/setter method `name`. 
Firebase-react should generate these automatically, so you shouldn't need to 
use this.
