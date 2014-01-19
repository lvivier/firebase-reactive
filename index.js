
/**
 * Dependencies
 */
var Emitter = require('emitter')

module.exports = React

/**
 * React
 */
function React (db) {
  // constructor guard
  if (!(this instanceof React)) return new React(db);

  this._firebase = db
  this._cache = {}
  this.attrs = {}

  var me = this

  // binds
  db.on('child_added', change)
  db.on('child_removed', change)
  db.on('child_changed', change)
  db.on('child_removed', remove)
  db.once('value', init)

  // init handler
  function init () { me.emit('initialize') }

  // change handler
  function change (child) {
    var name = child.name()
    var val = child.val()

    // create accessor and cache value
    me.attrs[name] || me.attr(name)
    me._cache[name] = val

    me.emit('change', name, val)
    me.emit('change '+name, val)
  }

  // remove handler
  function remove (ref) {
    me.exists(function (bool) {
      if (bool) return
      me.ref().off('child_removed', remove)
      me.emit('remove')
    })
  }
}

// React is an emitter
Emitter(React.prototype)

/**
 * Plugins
 */
React.use = function use (fn) {
  fn(this)
  return this
}

/**
 * Returns Firebase reference
 */
React.prototype.ref = function ref ()
{
  return this._firebase
}

/**
 * Set multiple attributes at once
 */
React.prototype.set = function set (obj) {
  if ('object' !== typeof obj) return fn(new Error('expected object'))

  this.emit('setting', obj)
  this.ref().update(obj)
  return this
}

/**
 * Remove all values
 */
React.prototype.remove = function remove (fn) {
  var me = this

  this.ref().remove(done)

  function done (err) {
    if (err) return me.emit('error', err)
    fn && fn(err)
  }
  return this
}

/**
 * Does this location exist?
 */
React.prototype.exists = function exists (fn) {
  this.ref().once('value', done)
  function done (data) { fn(data.hasChildren()) }
  return this
}

/**
 * Returns the name
 */
React.prototype.id = function id () {
  return this.ref().name()
}

/**
 * Defines an attribute accessor
 */
React.prototype.attr = function attr (name, opts) {
  var self = this
  if (this[name]) return this

  this.attrs[name] = opts || {}
  this.emit('attr', name, opts)

  // accessor
  this[name] = function (val) {
    if (0 === arguments.length) return this._cache[name]
    this
      .ref()
      .child(name)
      .set(val, function(err) { self.emit('error', err) })
    this._cache[name] = val
    return this
  }
  return this
}
