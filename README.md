bloom.js
========

A bloom filter implemented as a Node.js module.

Description
========
A bloom filter is a probabilistic data structure used to test for membership in a set. It is a great way to track whether you have seen a given value previously or not. 

For example, if you are implementing a web crawler you may want to be able to quickly identify whether you have seen a given page before or not. A bloom filter represents a low memory and fast way to do that detection, without needing to do a full search of your entire dataset.

bloom.js provides a simple interface and implementation in pure javascript designed for Node.js applications. With little effort it could be modified to fit browser implementations as well.

Installation
========
    npm install bloom.js
    
Usage
========
    var BloomFilter = require('bloom.js');

Add a value to the filter:

    BloomFilter.add(value); 
    
Check set membership:

    BloomFilter.isMember(value);
    
That's all you need for basic usage.

Advanced Usage
========
If you'd like to use a BloomFilter between sessions or restarts, you can serialize the filter and restore it later. This is accomplished through some convenience methods:

    var bytes = BloomFilter.getDate();
    
And load it later:

    BloomFilter.loadData(bytes);
    
Or, if you're lazy you can save it to a file:

    BloomFilter.saveDataFile('filename.data');
    
And load from a file later:

    BloomFilter.loadDataFile('filename.data');

How does it work?
========
Bloom filters work by taking a given input and hashing it many times. Every hash results in a value which maps to an entry in a byte array. Ideally, if you have enough hash functions that are sufficiently independent, the resulting sequence of hash values (the "signature" of the value) should be unique. 

When a new entry is added, all of these hashes are run on the input and the value of the entry in the byte array corresponding to the value is set to 1. Note that this means a single entry may touch dozens of entries in the byte array. While many different inputs may attempt to set the same entry to 1, it will only be set once. 

When you want to see if an entry is a member of the set, you simply apply the same hash functions and see if all the corresponding entries are 1. If no then you have not seen the entry before. If yes, you MIGHT have seen it before but you can't be sure (It is possible that a random array of other entries happen to set all those values to 1). However, with proper implementation the chances of a false positive are very low (less than 1%). 

Obviously the byte array used to store the values needs to be sufficiently large that adding the number of values you want to add does not set all the values to 1. This is a tuning aspect of the algorithm.

You can read more about Bloom Filters here: http://en.wikipedia.org/wiki/Bloom_filter

Bill Mill has a great description of bloom filters which helped in creating bloom.js: http://billmill.org/bloomfilter-tutorial/

