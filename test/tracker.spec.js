var Tracker = require('../tracker')
var expect = require('chai')

describe('Tracker#Dependency', function() {
  it('should be a constructor', function() {
    expect(new Tracker.Dependency).to.be.an.instanceOf(Tracker.Dependency)
  })
  
  it('should have methods of `depend` and `changed`', function() {
    var dep = new Tracker.Dependency
    
    expect(dep).to.respondTo('depend')
    expect(dep).to.respondTo('changed')
  })
})

// describe('dependency instance', function() {
//   it('should')
// })
