
/**
 * Dependencies
 */
var Firebase = window.Firebase
var React = require('firebase-react')
var assert = require('assert')

var key = Date.now()
var db = new Firebase('https://reactivetest.firebaseio.com/test/'+key)

/**
 * Test suite
 */
suite('React')
test('emits ready', function(done) {
  React(db).on('ready', done)
})

test('emits error on security failure', function(done) {
  var react = React(db.root())
    .attr('error')
    .on('error', function(err) {
      assert(err instanceof Error)
      done()
    })
  // we are not allowed to set "test" in rules.json
  assert.doesNotThrow(function() {
    react.error('test')
  })
})


suite('Reactive interface')
test('emits change events', function (done) {
  var i = 0
  var react = React(db)
    .attr('foo')
    .on('change', accum)
    .on('change foo', accum)
  
  react.foo('qux')

  function accum () {
    if (react.foo() == 'qux') i++
    if (i==2) done()
  }
})


suite('React#ref()')
test('returns a firebase reference', function() {
  var react = React(db)
  assert(react.ref() == db)
})


suite('React#id()')
test('returns the name of this ref', function() {
  var react = React(db)
  assert(react.id() == key)
})

test('aliased to React#id()', function () {
  assert(React.prototype.name === React.prototype.id)
})


suite('React#attr()')
test('defines an accessor method', function () {
  var react = React(db).attr('foo')
  assert('function' == typeof react.foo)
})

test('stores options passed to accessor', function () {
  var opts = {required:'true'}
  var react = React(db).attr('baz', opts)
  assert(react.attrs.baz === opts)
})


suite('React#set()')
test('replaces all attributes', function(done) {
  var react = React(db)
    .attr('foo')
    .foo('bar')
    .set({foo:'baz'}, function () {
      assert(react.foo() === 'baz')
      done()
    })
})


suite('React#remove()')
test('removes everything', function(done) {
  var react = React(db)
    .attr('foo')
    .foo('bar')
    .remove(function() {
      react.ref().once('value', val)
    })
  function val(data) {
    assert(data.val() === null)
    done()
  }
})
