'use strict';

var bcrypt = require('bcrypt'),
    Mongo  = require('mongodb'),
    _      = require('lodash');
function User(){
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, function(err, obj){
    cb(err, _.create(User.prototype, obj));
  });
};

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(user){return cb();}
    o.password = bcrypt.hashSync(o.password, 10);
    User.collection.save(o, cb);
  });
};

User.authenticate = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(o.password, user.password);
    if(!isOk){return cb();}
    cb(user);
  });
};

User.findAllByIsvisible = function(isvisible, cb){
  User.collection.find({isvisible:true}).toArray(cb);
};

User.findOne = function(filter, cb){
  User.collection.findOne(filter, cb);
};

User.prototype.send = function(receiver, obj, cb){
  switch(obj.mtype){
    case 'text':
      sendText(receiver.phone, obj.message, cb);
      break;
    case 'email':
      break;
    case 'internal':
  }
};
User.prototype.save = function(o, cb){
  var properties = Object.keys(o),
      self       = this;
  properties.forEach(function(property){
    switch(property){
      case 'visible':
        self.isvisible = o[property] === 'public';
        break;
      default:
        self[property] = o[property];
    }
  });
  User.collection.save(this, cb);
};


module.exports = User;

function sendText(to, body, cb){
  var accountSid = 'AC0c8135e8f58bed1140814bdf2257dd32',
    authToken = process.env.TWILIO,
    client = require('twilio')(accountSid, authToken);

  client.messages.create({to: to, from: '+14434874971', body: body}, cb);

}

