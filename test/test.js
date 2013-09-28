/**
 * Tests for the Bloom.js bloom filter.
 */
var BloomFilter = require('../bloom.js');

// Test adding string elements to the set
exports['test addElements#strings'] = function(beforeExit, assert){
	var filter = new BloomFilter();
	filter.add('hello');
	
	filter.add('test');
	
    assert.equal(true, filter.contains('hello'));
    assert.equal(true, filter.contains('test'));
    assert.equal(false, filter.contains('blah'));
};

// Test adding number elements to the set
exports['test addElements#numbers'] = function(beforeExit, assert){
	var filter = new BloomFilter();
	filter.add(12345);
	
	filter.add(987453);
	
    assert.equal(true, filter.contains(12345));
    assert.equal(true, filter.contains(987453));
    assert.equal(false, filter.contains(84422));
};

// Test saving and loading data
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

// Test the statistical performance and compare against theoretical
exports['test statisticalAccuracy#random'] = function(beforeExit, assert){
	var buckets = 800;
	var hashes = 3;
	var entries = 100;

	var expectedFalsePositivesRate = BloomFilter.estimateFalsePositiveRate(entries, buckets, hashes);
	
	// generate random entries
	var goodEntries = new Array();
	for(var i = 0; i < entries; i++)
	{
		goodEntries.push(Math.random());
	}
	
	// build the filter
	var filter = new BloomFilter(buckets, hashes);
	for(var i = 0; i < entries; i++)
	{
		filter.add(goodEntries[i]);
	}
	
	// test the filter
	for(var i = 0; i < entries; i++)
	{
    	assert.equal(true, filter.contains(goodEntries[i]));
	}
	
	// Figure out a false positive rate
	var badEntries = new Array();
	for(var i = 0; i < entries; i++)
	{
		var newValue = Math.random();
		if(goodEntries.indexOf(newValue) < 0) // dont' add something we know is in there
		{
			badEntries.push(newValue);
		}
	}
	var falsePositives = 0
	for(i = 0; i < badEntries.length; i++)
	{
		if(filter.contains(badEntries[i]))
		{
			falsePositives++;
		}
	}
	var actualFalsePositivesRate = falsePositives / badEntries.length;
	
	console.log('False Positive Rate: ' + actualFalsePositivesRate);
	console.log('Expected FPR: ' + expectedFalsePositivesRate);
	
	var difference = actualFalsePositivesRate - expectedFalsePositivesRate;
	var acceptableVariation = expectedFalsePositivesRate * 0.75; // accept no more than 1.75x expected
	
	
	console.log('Difference: ' + difference);
	console.log('Acceptable Diff: ' + acceptableVariation);
	
    assert.equal(true, difference < acceptableVariation);
};

