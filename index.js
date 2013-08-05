/**
 * Dependencies
 */

var Emitter = require('emitter')

/**
 * React
 */

module.exports = React

function React (db) {
  if (!(this instanceof React)) return new React(db);

  this._firebase = db
  this._cache = {}
  this.attrs = {}

  var me = this

  db.once('value', ready)
  db.on('child_added', change)
  db.on('child_removed', change)
  db.on('child_changed', change)

  function ready () { me.emit('ready') }
  function change (child) {
    var name = child.name()
      , val = child.val()

    me._cache[name] = val
    me.attrs[name] || me.attr(name, null)

    me.emit('change', name, val)
    me.emit('change '+name, val)
  }
}

Emitter(React.prototype)

React.use = function use (fn) {
  fn(this)
  return this
}

React.prototype.ref = function ref ()
{
  return this._firebase
}

React.prototype.attr = function attr (name, opts)
{
  if (this[name]) return
  this.attrs[name] = opts

  // getter/setter
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
