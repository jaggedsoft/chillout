/* global describe, it, expect, chillout */

describe('chillout test', function() {
  'use strict';

  describe('each', function() {
    it('array', function(done) {
      var values = [];
      var keys = [];
      chillout.each([1, 2, 3], function(value, i) {
        values.push(value);
        keys.push(i);
      }).then(function() {
        assert.deepEqual(values, [1, 2, 3]);
        assert.deepEqual(keys, [0, 1, 2]);
        done();
      });
    });

    it('object', function(done) {
      var values = [];
      var keys = [];
      chillout.each({ a: 1, b: 2, c: 3 }, function(value, key) {
        values.push(value);
        keys.push(key);
      }).then(function() {
        assert.deepEqual(values, [1, 2, 3]);
        assert.deepEqual(keys, ['a', 'b', 'c']);
        done();
      });
    });

    it('array-like object', function(done) {
      var values = [];
      var keys = [];
      chillout.each({ 0: 1, 1: 2, 2: 3, length: 3 }, function(value, i) {
        values.push(value);
        keys.push(i);
      }).then(function() {
        assert.deepEqual(values, [1, 2, 3]);
        assert.deepEqual(keys, [0, 1, 2]);
        done();
      });
    });

    it('array with context', function(done) {
      var context = {
        values: [],
        keys: []
      };
      chillout.each([1, 2, 3], function(value, i) {
        this.values.push(value);
        this.keys.push(i);
      }, context).then(function() {
        assert.deepEqual(context.values, [1, 2, 3]);
        assert.deepEqual(context.keys, [0, 1, 2]);
        done();
      });
    });

    it('object with context', function(done) {
      var context = {
        values: [],
        keys: []
      };
      chillout.each({ a: 1, b: 2, c: 3 }, function(value, key) {
        this.values.push(value);
        this.keys.push(key);
      }, context).then(function() {
        assert.deepEqual(context.values, [1, 2, 3]);
        assert.deepEqual(context.keys, ['a', 'b', 'c']);
        done();
      });
    });

    it('stop iteration (array)', function(done) {
      var values = [];
      var keys = [];
      chillout.each([1, 2, 3], function(value, i) {
        values.push(value);
        keys.push(i);
        if (value === 2) {
          return false;
        }
      }).then(function() {
        assert.deepEqual(values, [1, 2]);
        assert.deepEqual(keys, [0, 1]);
        done();
      });
    });

    it('stop nested iteration (array)', function(done) {
      var values = [];
      var keys = [];
      chillout.each([1, 2, 3], function(value, i) {
        values.push(value);
        keys.push(i);
        if (value === 2) {
          return new Promise(function(resolve, reject) {
            resolve(false);
          });
        }
      }).then(function() {
        assert.deepEqual(values, [1, 2]);
        assert.deepEqual(keys, [0, 1]);
        done();
      });
    });

    it('stop iteration (object)', function(done) {
      var values = [];
      var keys = [];
      chillout.each({ a: 1, b: 2, c: 3 }, function(value, key) {
        values.push(value);
        keys.push(key);
        if (value === 2) {
          return false;
        }
      }).then(function() {
        assert.deepEqual(values, [1, 2]);
        assert.deepEqual(keys, ['a', 'b']);
        done();
      });
    });

    it('stop nested iteration (object)', function(done) {
      var values = [];
      var keys = [];
      chillout.each({ a: 1, b: 2, c: 3 }, function(value, key) {
        values.push(value);
        keys.push(key);
        if (value === 2) {
          return new Promise(function(resolve, reject) {
            resolve(false);
          });
        }
      }).then(function() {
        assert.deepEqual(values, [1, 2]);
        assert.deepEqual(keys, ['a', 'b']);
        done();
      });
    });
  });

  describe('repeat', function() {
    it('specify number', function(done) {
      var n = 0;
      chillout.repeat(5, function(i) {
        assert(n++ === i);
      }).then(function() {
        assert(n === 5);
        done();
      });
    });

    it('specify object', function(done) {
      var n = 10;
      chillout.repeat({ start: 10, step: 2, end: 20 }, function(i) {
        assert(n === i);
        n += 2;
      }).then(function() {
        assert(n === 20);
        done();
      });
    });

    it('with context', function(done) {
      var context = {
        n: 0
      };
      chillout.repeat(5, function(i) {
        assert(this.n++ === i);
      }, context).then(function() {
        assert(context.n === 5);
        done();
      });
    });

    it('stop iteration', function(done) {
      var n = 0;
      chillout.repeat(5, function(i) {
        assert(n++ === i);
        if (n === 3) {
          return false;
        }
      }).then(function() {
        assert(n === 3);
        done();
      });
    });
  });

  describe('forever', function() {
    it('10 times', function(done) {
      var i = 0;
      chillout.forever(function() {
        if (++i === 10) {
          return false;
        }
      }).then(function() {
        assert(i === 10);
        done();
      });
    });

    it('10 times with context', function(done) {
      var context = { i: 0 };
      chillout.forever(function() {
        if (++this.i === 10) {
          return false;
        }
      }, context).then(function() {
        assert(context.i === 10);
        done();
      });
    });
  });
});
