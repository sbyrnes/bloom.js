/**
 * Bloom.js 
 * 
 * Javascript implementation of a Bloom Filter.. 
 */
 
var setData = new Uint8Array(100); 
 
/**
 * Adds a value to the filter set.
 * @param value The value to add to the set.
 */ 
function add(value)
{
	
}

/**
 * Tests whether a given value is a member of the filter set.
 * @param value The value to test for.
 * @return False if not in the set. True if likely to be in the set.
 */ 
function isMember(value)
{
	return false;
}  

/**
 * Returns the filter set data for persistence or sharing.
 * @return The filter data as a byte array.
 */ 
function getData()
{
	return setData;
}  

/**
 * Loads the given filter data.
 * @param data The filter data as a byte array.
 * @return True if successful, false otherwise.
 */ 
function loadData(data)
{
	// TODO: We should probably validate the data.
	return setData = data;
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
// TODO: This is a placeholder hash function.
function hash(value)
{
	return 0;
}

/***** Binary file reading and writing *********/
/**
 * Thanks to the top answer on StackOverflow found here:
 * http://stackoverflow.com/questions/7329128/how-to-write-binary-data-to-a-file-using-node-js
 */
function saveToFile(filename, data) {

  var fs = IMPORTS.require('fs');

  var fd =  fs.openSync(filename, 'w');

  var buff = new Buffer(data, 'base64');

  fs.write(fd, buff, 0, buff.length, 0, function(err,written){
		// ERROR HANDLING GOES HERE
  });
}
function readFromFile(filename) {

  var fs = IMPORTS.require('fs');

  var fd =  fs.openSync(filename, 'r');
  
  // TODO: Read the file in via Buffer
  
  return data;
}


 
module.exports.add = add;
module.exports.isMember = isMember;
module.exports.getData = getData;
module.exports.loadData = loadData;
module.exports.saveDataFile = saveDataFile;
module.exports.loadDataFile = loadDataFile;