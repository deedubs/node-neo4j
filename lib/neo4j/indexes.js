var request = require('superagent');

module.exports.extend = function extend(Neo4j) {
  Neo4j.prototype.createNodeIndex = function(indexName, options, callback) {
    createIndex.call(this, 'node', indexName, options, callback);
  }

  Neo4j.prototype.deleteNodeIndex = function(indexName, options, callback) {
    deleteIndex.call(this, 'node', indexName, options, callback);
  }

  Neo4j.prototype.listNodeIndexes = function(callback) {
    listIndexes.call(this, 'node', callback);
  }

  Neo4j.prototype.addNodeToIndex = function(indexName, item, callback) {
    addToIndex.call(this, 'node',indexName, item, callback);
  }
}

function addToIndex(indexType, indexName, item, callback) {
  var that = this;
console.log(that.url + '/db/data/index/' + indexType + '/' + indexName);
console.log(item);
  request
    .post(that.url + '/db/data/index/' + indexType + '/' + indexName)
    .send(item)
    .set('Accept', 'application/json')
    .end(function(res){
      switch(res.statusCode) {
        case 200:
        case 201:
          delete res.body.nodes;
          callback(null, res.body);
          break;
      }
    });
}

function listIndexes(indexType, callback) {
  var that = this;

  request
    .get(that.url + '/db/data/index/' + indexType)
    .set('Accept', 'application/json')
    .end(function(res){
      switch(res.statusCode) {
        case 200:
        case 201:
          delete res.body.nodes;
          callback(null, resultToArray(res.body));
          break;
      }
    });
}

function createIndex(indexType, indexName, options, callback) {
  if(typeof(options) == 'function') {
    callback = options;
    options = {};
  }

  options.name = indexName;

  var that = this;

  request
    .post(that.url + '/db/data/index/' + indexType)
    .send(options)
    .set('Accept', 'application/json')
    .end(function(res){
      switch(res.statusCode) {
        case 200:
        case 201:
          callback(null, res.body);
          break;
      }
    });
}

function deleteIndex(indexType, indexName, callback) {

  var that = this
    , indexUrl = that.url + '/db/data/index/' + indexType + '/' + indexName;

  request
    .del(indexUrl)
    .set('Accept', 'application/json')
    .end(function(res){
      switch(res.statusCode) {
        case 204:
          callback(null, res.body);
          break;
      }
    });
}

function resultToArray(result) {
  var results = []
    , index;

  for(index in result) {
    var entry = result[index];
    entry.name = index;
    results.push(entry);
  }

  return results;
}