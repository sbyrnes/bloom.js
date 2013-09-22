/**
 * Tests for the Bloom.js bloom filter.
 */
var BloomFilter = require('../bloom.js');

// Test adding elements to the set
exports['test addElements#strings'] = function(beforeExit, assert){
	BloomFilter.add('hello');
	
	BloomFilter.add('test');
	
    assert.equal(true, BloomFilter.contains('hello'));
    assert.equal(true, BloomFilter.contains('test'));
    assert.equal(false, BloomFilter.contains('blah'));
};

exports['test addElements#numbers'] = function(beforeExit, assert){
	BloomFilter.add(12345);
	
	BloomFilter.add(987453);
	
    assert.equal(true, BloomFilter.contains(12345));
    assert.equal(true, BloomFilter.contains(987453));
    assert.equal(false, BloomFilter.contains(84422));
};

exports['test getAndLoadData#numbers'] = function(beforeExit, assert){
	BloomFilter.add(12345);
	BloomFilter.add(987453);
	
	var data = BloomFilter.getData();
	BloomFilter.loadData(data);
	
    assert.equal(true, BloomFilter.contains(12345));
    assert.equal(true, BloomFilter.contains(987453));
    assert.equal(false, BloomFilter.contains(84422));
};

exports['test saveAndLoadData#numbers'] = function(beforeExit, assert){
	assert.equal(true, false);
};

