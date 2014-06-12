'use strict';

var _ = require('underscore');

var MemmoryBackend = {};

exports = module.exports = MemmoryBackend;

var memmory = {};


function getBucket(bucketName) {
  return memmory[bucketName];
}


function ensureBucket(bucketName) {
  var bucket = getBucket(bucketName);

  if (!bucket) {
    bucket = memmory[bucketName] = {};
  }

  return bucket;
}


MemmoryBackend.createId = function (bucketName) {
  var bucket = getBucket(bucketName);
  var random = Math.floor(Math.random() * 1000001);
  var timestamp = new Date().getTime();
  var id = '' + timestamp + random;

  return bucket && bucket[id] ? this.createId(bucketName) : id;
};


MemmoryBackend.getBucket = function (bucketName, callback) {
  setTimeout(function () {
    callback(null, getBucket(bucketName));
  }, 0);
};


MemmoryBackend.get = function (bucketName, id, callback) {
  var bucket = getBucket(bucketName);
  var data = bucket && bucket[id] || null;

  setTimeout(function () {
    callback(null, data);
  }, 0);
};


MemmoryBackend.insert = function (bucketName, data, callback) {
  var bucket = ensureBucket(bucketName);

  setTimeout(function () {
    if (!data.id) {
      data.id = MemmoryBackend.createId(bucketName);
    }

    bucket[data.id] = data;
    console.log('Data inserted in', bucketName, 'bucket:', data);

    if (callback) {
      callback(null, data.id, data);
    }
  }, 0);
};


MemmoryBackend.update = function (bucketName, id, update, callback) {
  MemmoryBackend.get(bucketName, id, function (err, data) {
    if (data) {
      _.extend(data, update);
      if (callback) {
        callback(null, data);
      }
    } else {
      if (callback) {
        callback(null, null);
      }
    }
  });
};


MemmoryBackend.remove = function (bucketName, id, callback) {
  var bucket = getBucket(bucketName);

  setTimeout(function () {
    if (bucket) {
      delete bucket[id];
    }

    callback(null, null);
  }, 0);
};

