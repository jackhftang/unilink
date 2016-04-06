import Link from '../build/Link';

var assert = require('assert');

var print = console.log.bind(console);

describe('Link', function(){
  var a = null;
  var b = null;

  var init2 = function(){
    a = new Link();
    b = new Link();
    a.send = b.feed.bind(b);
    b.send = a.feed.bind(a)
  };

  describe('emit', function(){
    
    it('test 1', function(done){
      init2();
      var event = 'e';
      a.on(event, function(a,b,c){
        assert(a === 1);
        assert(b === 2);
        assert(c === 3);
        done()
      });
      b.emit(event, 1, 2, 3)
    });

    it('nested once should be called next time', function(done){
      init2();
      var event = 'e';
      var called = 0;
      a.once(event, function(){
        called++;
        a.once(event, function(){
          assert.equal(called, 1);
          done()          
        })
      });
      b.emit(event);
      assert.equal(called, 1);
      b.emit(event)
    })

  });


  describe('request', function(){
    
    it('test 1', function(done){
      init2();
      var event = 'e';
      a.reply(event, function(data, ret){
        ret(null,data,3)
      });
      b.request(event, 2, function(err, a,b){
        assert.equal(a,2);
        assert.equal(b,3);
        done()
      })
    });

    it('test 2', function(done){
      init2();
      var event = 'e';
      a.reply(event, function(data, ret){
        ret(data,3)
      });
      b.request(event, 2, function(a,b){
        assert.equal(a,2);
        assert.equal(b,3);
        done()
      })
    });

    it('timeout', function(done){
      init2();
      var event = 'e';
      a.reply(event, function(data, ret){
        // not return
      });
      b.request(event, {}, function(err){
        assert.equal(err.slice(0,7), 'timeout');
        done()
      }, 500)
    })

  })

});