module.exports = react

function react (db) {
  var callbacks = {}
    , cache = {}

  db.attrs = {}
  db._on = db.on

  db.attr = function (name, opts, silent) {

    if (db[name]) {
      if (silent) return
      throw new Error('attribute ' + name + ' is reserved')
    }

    db.attrs[name] = opts

    // getter/setter
    db[name] = function (val) {
      if (0 === arguments.length) return cache[name]
      db.child(name).set(val)
      cache[name] = val
      return db
    }
    return db
  }

  db.on = function on (name, fn, cancel, context) {
    // delegate to real `on`
    if (0 !== name.indexOf('change')) return db._on(name, fn, cancel, context)

    if (callbacks[name] && callbacks[name].length)
      callbacks[name].push(fn)
    else
      callbacks[name] = [fn]

    return db
  }

  db.emit = function emit (name) {
    var args = Array.prototype.slice.call(arguments, 1)
    if (callbacks[name] && callbacks[name].length) {
      for (var i=0,len=callbacks[name].length; i < len; i++) {
        callbacks[name][i].apply(null, args)
      }
    }
  }

  db.on('child_added', change)
  db.on('child_removed', change)
  db.on('child_changed', change)

  function change (child) {
    var name = child.name()
      , val = child.val()

    cache[name] = val

    db.attrs[name] || db.attr(name, null, true)

    db.emit('change', name, val)
    db.emit('change '+name, val)
  }

  return db
}
