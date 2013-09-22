/**
 * Bloom.js 
 * 
 * Javascript implementation of a Bloom Filter.. 
 */
var MurmurHash = require('./murmurhash.js');
var BitArray = require('bit-array');
 
var numBuckets = 1000;
var numHashes = 5; 
 
var bitVector = new BitArray(numBuckets); 
 
/**
 * Adds a value to the filter set.
 * @param value The value to add to the set.
 */ 
function add(value)
{	
	hashify(String(value), function(index) { bitVector.set(index, true); });
}

/**
 * Tests whether a given value is a member of the filter set.
 * @param value The value to test for.
 * @return False if not in the set. True if likely to be in the set.
 */ 
function contains(value)
{
	var result = true;

	hashify(String(value), function(index) { if(!bitVector.get(index)) result = false; });
	
	return result;
}  

/**
 * Calculates hashes on the given value and involkes operator on each of the values.
 * @param value The value to hashify.
 * @param operator The function to call on all hash values individually.
 */ 
function hashify(value, operator)
{
	// We can calculate many hash values from only a few actual hashes, using the method 
	// described here: http://www.eecs.harvard.edu/~kirsch/pubs/bbbf/esa06.pdf
	var hash1 = MurmurHash.murmurhash3_32_gc(value, 0);
	var hash2 = MurmurHash.murmurhash3_32_gc(value, hash1);
	
	// Generate indexes using the function: 
	// h_i(x) = (h1(x) + i * h2(x)) % numBuckets
	for(i = 0; i < numHashes; i++)
	{	
		var index = Math.abs((hash1 + i * hash2) % numBuckets);
		operator(index);
	}
}

/**
 * Returns the filter set data for persistence or sharing.
 * @return The filter data as a byte array.
 */ 
function getData()
{
	return bitVector;
}  

/**
 * Loads the given filter data.
 * @param data The filter data as a byte array.
 * @return True if successful, false otherwise.
 */ 
function loadData(data)
{
	// TODO: We should probably validate the data.
	return bitVector = data;
} 

/**
 * Saves the filter set data to the specified file.
 * @param filename The fully qualified path to the file where the data should be saved.
 * @return True if successful, false otherwise.
 */ 
function saveDataFile(filename)
{
	saveToFile(filename, getData());
	return false;
}  

/**
 * Loads the filter set data from the specified file.
 * @param filename The fully qualified path to the file where the data should be loaded.
 * @return True if successful, false otherwise.
 */ 
function loadDataFile(data)
{
	
	return false;
} 

/***** Hash Functions *********/
// Abstraction wrapper function to make it easier to swap in hash functions later.
function hash(value, seed)
{	
	return MurmurHash.murmurhash3_32_gc(value, seed);
}

/***** File IO **********/
function saveToFile(filename, data) {

  	var fs = IMPORTS.require('fs');
	fs.writeFile(filename, data, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("The file was saved!");
		}
	}); 
}
function readFromFile(filename) {

  	var fs = IMPORTS.require('fs');
	fs = require('fs')
	fs.readFile('/etc/hosts', 'utf8', function (err,data) {
	  if (err) {
		return console.log(err);
	  }
	  console.log(data);
	});
}


 
module.exports.add = add;
module.exports.contains = contains;
module.exports.getData = getData;
module.exports.loadData = loadData;
module.exports.saveDataFile = saveDataFile;
module.exports.loadDataFile = loadDataFile;