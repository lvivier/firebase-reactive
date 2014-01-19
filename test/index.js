
/**
 * Dependencies
 */
var Firebase = window.Firebase
var React = require('firebase-react')
var assert = require('assert')

var key = Date.now()
var db = new Firebase('https://reactivetest.firebaseio.com/test/'+key)

/**
 * Tests
 */

suite('React')

test('emits \'initialize\'', function(done) {
  React(db).on('initialize', done)
})

test('emits \'error\'', function(done) {
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
    .once('change', accum)
    .once('change foo', accum)
  
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


suite('React#attr()')
test('defines an accessor method', function () {
  var react = React(db).attr('foo')
  assert('function' == typeof react.foo)
})

test('stores options', function () {
  var opts = {required:'true'}
  var react = React(db)
    .attr('baz', opts)
    .attr('qux')
  assert(react.attrs.baz === opts)
  assert('object' == typeof react.attrs.qux)
})

test('emits \'attr\'', function (done) {
  var react = React(db)
    .once('attr', function(){ done() })
    .attr('derp')
})

suite('React#set()')
test('sets multiple attributes', function() {
  var react = React(db)
    .attr('foo')
    .attr('bar')
    .foo('baz')
    .bar('qux')
    .set({foo:'baz'})
  
  assert(react.foo() === 'baz')
  assert(react.bar() === 'qux')
})

test('emits \'setting\'', function(done) {
  var react = React(db)
    .on('setting', function(){ done() })
    .set({what: 'derp'})
})


suite('React#remove()')
test('removes data at location', function(done) {
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

test('emits \'removing\'', function(done) {
  var react = React(db.child('foo'))
    .once('removing', function(){ done() })
    .remove()
})

test('emits \'remove\'', function(done) {
  var react = React(db.child('bar'))
    .once('remove', function(){ done() })
    .remove()
})
