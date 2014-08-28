/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    User      = require('../../app/models/user'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'facebook-test';

describe('User', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new User object', function(){
      var u = new User();
      expect(u).to.be.instanceof(User);
    });
  });
  describe('#save', function(){
    it('should save a user', function(){
      var  o = {x:3, visible:'public', foo:'bar'},
           u = new User();

      u.baz = 'bim';
      console.log('+++++++++', u);
      u.save(o, function(err, user){
        expect(user.isvisible).to.be.true;
        expect(user.foo).to.equal('bar');
        expect(user.baz).to.equal('bim');
      });
    });
  });
  describe('.findAllByIsvisible', function(){
    it('should get all the visible users from the database', function(done){
      User.findAllByIsvisible({isvisible:true}, function(err, users){
        expect(users.length).to.equal(4);
        done();
      });
    });
  });
  describe('.findOne', function(){
    it('should find a specific user', function(){
      User.findOne({email:'shrutijalewar@gmail.com', isvisible:true}, function(err, user){
        console.log('+++++++++++', user);
        expect(user.email).to.equal('shrutijalewar@gmail.com');
      });
    });
  });

  describe('#send', function(){
    it('should send a text message to a user', function(done){
      User.findById('000000000000000000000001', function(err, sender){
        User.findById('000000000000000000000002', function(err, receiver){
          sender.send(receiver, {mtype:'text', message:'yo'}, function(err, response){
            expect(response.sid).to.be.ok;
            done();
          });
        });
      });
    });
  });
  describe('#send', function(){
    it('should send a mail message to a user', function(done){
      User.findById('000000000000000000000002', function(err, sender){
        User.findById('000000000000000000000001', function(err, receiver){
          sender.send(receiver, {mtype:'email', message:'yo'}, function(err, response){
            expect(response.id).to.be.ok;
            done();
          });
        });
      });
    });
  });
});

