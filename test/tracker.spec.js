var Tracker = require('../src/tracker')
var expect = require('chai').expect
var Promise = require('es6-promise-polyfill').Promise
var ReactiveDict = require('./reactive-dict')
var Logger = require('./helper').Logger

var later = function() {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 10)
  })
}

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


describe('Tracker', function() {
  var logger,
      actual,
      favoriteFood,
      favoriteFoodDep,
      getFavoriteFood,
      setFavoriteFood
  
  beforeEach(function() {
    actual = 'apples'
    favoriteFood = 'apples'
    favoriteFoodDep = new Tracker.Dependency
    
    getFavoriteFood = function () {
      favoriteFoodDep.depend()
      return favoriteFood
    }
    
    setFavoriteFood = function (newValue) {
      favoriteFood = newValue
      favoriteFoodDep.changed()
    }
    
    logger = new Logger
  })
   
  it('should run immediately when `Tracker.autorun` is called', function() {
    var handle = Tracker.autorun(function () {
      logger.logger('Your favorite food is ' + getFavoriteFood())
    })
    
    expect(logger.log[0]).to.eql('Your favorite food is apples')
  })
  
  it('should make a value reative', function(done) {
    var handle = Tracker.autorun(function () {
      logger.logger('Your favorite food is ' + getFavoriteFood())
    })
    
    
    actual = 'mangoes'
    setFavoriteFood(actual)
    
    later()
      .then(function() {
        expect(logger.log.length).to.eql(2)
        expect(logger.log[0]).to.eql('Your favorite food is apples')
        expect(logger.log[1]).to.eql('Your favorite food is mangoes')
      })
      .then(done)
  })
  
  it('should flush changes in the next tick', function(done) {
    
    var handle = Tracker.autorun(function () {
      logger.logger('Your favorite food is ' + getFavoriteFood())
    })
    
    actual = 'mangoes'
    setFavoriteFood(actual)
    
    actual = 'bananas'
    setFavoriteFood(actual)
    
    later()
      .then(function() {
        expect(logger.log.length).to.eql(2)
        expect(logger.log[0]).to.eql('Your favorite food is apples')
        expect(logger.log[1]).to.eql('Your favorite food is bananas')
      })
      .then(done)  
  })
  
  it('should allow nested autorun', function(done) {
    var weather = new ReactiveDict
    weather.set('sky', 'sunny')
    weather.set('temperature', 'cool')
    
    var weatherPrinter = Tracker.autorun(function () {
      logger.logger('The sky is ' + weather.get('sky'))
      var temperaturePrinter = Tracker.autorun(function () {
        logger.logger('The temperature is ' + weather.get('temperature'))
      })
    })
    
    expect(logger.log.slice(0, 2)).to.eql(['The sky is sunny', 'The temperature is cool'])

    weather.set('temperature', 'hot')
        
    later()
      .then(function() {
        expect(logger.log[2]).to.eql('The temperature is hot')
        weather.set('sky', 'stormy')
      })
      .then(function() {
        return later()
      })
      .then(function() {
        expect(logger.log.length).to.eql(5)
        expect(logger.log[3]).to.eql('The sky is stormy')
        expect(logger.log[4]).to.eql('The temperature is hot')
      })
      .then(done)
  })
  
  it('should provide a `stop` method to stop making the value reactive', function(done) {
    var handle = Tracker.autorun(function() {
      logger.logger('Your favorite food is ' + getFavoriteFood())
    })
    
    expect(logger.log.length).to.eql(1)
    expect(logger.log[0]).to.eql('Your favorite food is apples')
    
    handle.stop()
    
    expect(logger.log.length).to.eql(1)
    
    later()
      .then(function() {
        expect(logger.log.length).to.eql(1)
      })
      .then(done)
  })
})