
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
  db.on('child_removed', change)
  db.on('child_changed', change)
  db.on('child_added', change)
  db.once('value', ready, error)

  // ready handler
  function ready () { me.emit('ready') }

  // error handler
  function error (err) { me.emit('error', err) }

  // change handler
  function change (child) {
    var name = child.name()
    var val = child.val()

    // create accessor and cache value
    me.attrs[name] || me.attr(name, null)
    me._cache[name] = val

    me.emit('change', name, val)
    me.emit('change '+name, val)
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
 * Replace all attributes at once
 */
React.prototype.set = function set (obj, fn) {
  if ('object' !== typeof obj) return fn(new Error('expected object'))

  this.ref().set(obj, done)
  function done (err) { fn && fn(err, this) }
  return this
}

/**
 * Remove all values
 */
React.prototype.remove = function remove (fn) {
  this.ref().remove(done)
  function done (err) { fn && fn(err) }
}

/**
 * Does this location exist?
 */
React.prototype.exists = function exists (fn) {
  this.ref().once('value', done)
  function done (data) { fn(data.hasChildren()) }
}

/**
 * Defines an attribute accessor
 */
React.prototype.attr = function attr (name, opts)
{
  if (this[name]) return
  this.attrs[name] = opts

  // accessor
  this[name] = function (val) {
    if (0 === arguments.length) return this._cache[name]
    this
      .ref()
      .child(name)
      .set(val)
    this._cache[name] = val
    return this
  }
  return this
}
