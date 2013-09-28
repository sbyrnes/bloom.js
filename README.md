bloom.js
========

A bloom filter implemented as a Node.js module. 

Description
========
A bloom filter is a probabilistic data structure used to test for membership in a set. It is highly memory efficient and very fast, so it is a good tool when faced with a very large number of values in a set and testing set membership is performance sensitive.  

For example, if you are implementing a web crawler you may want to be able to quickly identify whether you have seen a given page before or not. Instead of looking up the page in your data store, you can register each page's text as a value in the bloom filter and quickly check. Since the bloom filter is memory efficient you can easily handle many thousands of web pages with very little space. 

Note that you cannot remove a value from a bloom filter after it is added. Read "How it works" below for an explanation.

bloom.js provides a simple interface and implementation in pure javascript designed for Node.js applications. With little effort it could be modified to fit browser implementations as well.

This implementation utilizes the Murmur Hash 3 implementation by Gary Court: http://github.com/garycourt/murmurhash-js and benefitted greatly from the Bloom Filter tutorial by Bill Mill: http://billmill.org/bloomfilter-tutorial/

Installation
========
    npm install bloom.js
    
Usage
========
<!-- language: lang-js -->
    var BloomFilter = require('bloom.js');
    
    var filter = new BloomFilter();

Add a value to the filter:
<!-- language: lang-js -->
    filter.add(value); 
    
Check set membership:
<!-- language: lang-js -->
    filter.contains(value);
    
That's all you need for basic usage.

Advanced Usage
========
The performance of a bloom filter is directly related to three factors: 
 * The number of values in the filter set
 * The number of hashes to apply to values
 * The number of buckets in the bit vector
 
The number of values in the filter set are determined by your use case, so it is common to tune the other two based on your needs. To do that you can optionally provide them to the constructor:
<!-- language: lang-js -->
	var filter = new BloomFilter(number_of_buckets, number_of_hashes);
  
To help you determine the correct number of buckets and hashes to use on your input set, there is a convenience static function that estimates the rate of false positives given a set of usage parameters. 
<!-- language: lang-js -->
	var expectedFalsePositivesRate = BloomFilter.estimateFalsePositiveRate(number_of_values, number_of_buckets, number_of_hashes);  
  
The expected false positive rate for a well tuned bloom filter should be around 1%.   
  
If you'd like to use a BloomFilter between sessions or restarts, you can serialize the filter and restore it later. This is accomplished through some convenience methods:
<!-- language: lang-js -->
    var data = filter.getData();
    
And load it later:
<!-- language: lang-js -->
    filter.loadData(data);

How does it work?
========
Bloom filters work by taking a given input and hashing it many times. Every hash results in a value which maps to an entry in a bit vector. Ideally, if you have enough hash functions that are sufficiently independent, the resulting sequence of hash values (the "signature" of the value) will be unique. 

To start, the bit vector is initialized to all zeroes. When a new entry is added, all of the hash functions are run on the input and the value of the entry in the byte array corresponding to each hash value is set to 1. Note that this means a single entry may touch dozens of entries in the byte array (if there are dozens of hash functions). While many different inputs may attempt to set the same entry to 1, it will only be set once. 

When you want to see if an entry is a member of the set, you simply apply the same hash functions and see if all the corresponding entries are 1. If no then you have not seen the entry before. If yes, you MIGHT have seen it before but you can't be sure (It is possible that a random array of other entries happen to set all those values to 1). However, with proper implementation the chances of a false positive are very low (less than 1%). 

Because of the fact that entries will map to some of the same entries, it is not possible to remove an entry from a bloom filter once it is added. There would be no way to untangle a single entry from all of the others, you would instead need to start a new filter.

Obviously the byte array used to store the values needs to be sufficiently large that adding the number of values you want to add does not set all the values to 1. This is a tuning aspect of the algorithm.

You can read more about Bloom Filters here: http://en.wikipedia.org/wiki/Bloom_filter
