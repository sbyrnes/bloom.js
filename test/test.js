/**
 * Tests for the Bloom.js bloom filter.
 */
var BloomFilter = require('../bloom.js');

// Test adding elements to the set
exports['test addElements#strings'] = function(beforeExit, assert){
	BloomFilter.add('hello');
	
	BloomFilter.add('test');
	
    assert.equal(true, BloomFilter.isMember('hello'));
    assert.equal(true, BloomFilter.isMember('test'));
    assert.equal(false, BloomFilter.isMember('blah'));
};

exports['test addElements#numbers'] = function(beforeExit, assert){
	BloomFilter.add(12345);
	
	BloomFilter.add(987453);
	
    assert.equal(true, BloomFilter.isMember(12345));
    assert.equal(true, BloomFilter.isMember(987453));
    assert.equal(false, BloomFilter.isMember(84422));
};

