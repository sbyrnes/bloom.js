/**
 * Bloom.js 
 * 
 * Javascript implementation of a Bloom Filter.
 *
 * @author <a href="mailto:sean@fogstack.com">Sean Byrnes</a>
 * @see https://github.com/sbyrnes/bloom.js
 */
var MurmurHash = require('./murmurhash.js');
var BitArray = require('bit-array');
 
var DEFAULT_NUM_BUCKETS = 1000;
var DEFAULT_NUM_HASHES = 5; 
 
var BloomFilter = function (buckets, hashes) {
 	
 	if(buckets) this.numBuckets = buckets;
 	else 		this.numBuckets = DEFAULT_NUM_BUCKETS;
 	
 	if(hashes)  this.numHashes = hashes;
 	else 		this.numHashes = DEFAULT_NUM_HASHES;
 
	this.bitVector = new BitArray(this.numBuckets); 
 }
 
/**
 * Adds a value to the filter set.
 * @param value The value to add to the set.
 */ 
BloomFilter.prototype.add = function(value)
{	
	this.hashify(String(value), function(index, bitVector) { bitVector.set(index, true); });
}

/**
 * Tests whether a given value is a member of the filter set.
 * @param value The value to test for.
 * @return False if not in the set. True if likely to be in the set.
 */ 
BloomFilter.prototype.contains = function(value)
{
	var result = true;

	this.hashify(String(value), function(index, bitVector) { if(!bitVector.get(index)) result = false; });
	
	return result;
}  

/**
 * Calculates hashes on the given value and involkes operator on each of the values.
 * @param value The value to hashify.
 * @param operator The function to call on all hash values individually.
 */ 
BloomFilter.prototype.hashify = function(value, operator)
{
	// We can calculate many hash values from only a few actual hashes, using the method 
	// described here: https://www.eecs.harvard.edu/~michaelm/postscripts/tr-02-05.pdf
	var hash1 = hash(value, 0);
	var hash2 = hash(value, hash1);
	
	// Generate indexes using the function: 
	// h_i(x) = (h1(x) + i * h2(x)) % numBuckets
	for(i = 0; i < this.numHashes; i++)
	{	
		var index = Math.abs((hash1 + i * hash2) % this.numBuckets);
		operator(index, this.bitVector);
	}
}

/**
 * Returns the filter set data for persistence or sharing.
 * @return The filter data as a byte array.
 */ 
BloomFilter.prototype.getData = function()
{
	return this.bitVector;
}  

/**
 * Loads the given filter data.
 * @param data The filter data as a byte array.
 * @return True if successful, false otherwise.
 */ 
BloomFilter.prototype.loadData = function(data)
{
	// TODO: We should probably validate the data.
	return this.bitVector = data;
} 

/***** Hash Functions *********/
// Abstraction wrapper function to make it easier to swap in hash functions later.
function hash(value, seed)
{	
	return MurmurHash.murmurhash3_32_gc(value, seed);
}
 
module.exports = BloomFilter;

/**
 * Estimate the false positive rate for a given set of usage parameters
 * @param numValues The number of unique values in the set to be added to the filter.
 * @param numBuckets The number of unique buckets (bits) in the filter
 * @param numHashes The number of hashes to use.
 * @return Estimated false positive percentage as a float.
 */ 
function estimateFalsePositiveRate(numValues, numBuckets, numHashes)
{
	// Formula for false positives is (1-e^(-kn/m))^k
	// k - number of hashes
	// n - number of set entries
	// m - number of buckets
	var expectedFalsePositivesRate = Math.pow((1 - Math.exp(-numHashes * numValues / numBuckets)), numHashes);
	
	return expectedFalsePositivesRate;
}

module.exports.estimateFalsePositiveRate = estimateFalsePositiveRate;