Bot = require('../src/bot').Bot
assert = require "assert"


describe 'Speak', ->
  it 'Should speak', ->
    assert 1 == 1


  it '', (done) ->
    bot = new Bot('AUTH', 'USERID')
    bot.on 'ready', ->
      done()
