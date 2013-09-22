/**
 * Tests for the Bloom.js bloom filter.
 */
var BloomFilter = require('../bloom.js');

// Test adding elements to the set
exports['test addElements#strings'] = function(beforeExit, assert){
	var filter = new BloomFilter();
	filter.add('hello');
	
	filter.add('test');
	
    assert.equal(true, filter.contains('hello'));
    assert.equal(true, filter.contains('test'));
    assert.equal(false, filter.contains('blah'));
};

exports['test addElements#numbers'] = function(beforeExit, assert){
	var filter = new BloomFilter();
	filter.add(12345);
	
	filter.add(987453);
	
    assert.equal(true, filter.contains(12345));
    assert.equal(true, filter.contains(987453));
    assert.equal(false, filter.contains(84422));
};

exports['test getAndLoadData#numbers'] = function(beforeExit, assert){
	var filter = new BloomFilter();
	filter.add(12345);
	filter.add(987453);
	
	var data = filter.getData();
	
	var newFilter = new BloomFilter();
	newFilter.loadData(data);
	
    assert.equal(true, newFilter.contains(12345));
    assert.equal(true, newFilter.contains(987453));
    assert.equal(false, newFilter.contains(84422));
};

