var should = require('should')
  , neo4j = require('../main')
  , dbUrl = process.env.NEO4J_URL
  , db = new neo4j(dbUrl);

describe('Indexing', function(){
  describe('Nodes', function(){

    it('should be able to create a node index with default settings', function(done) {
      db.createNodeIndex('testIndex', done);
    });

    it('should be able to create a node index with default settings', function(done) {
      var indexSettings = {
          name: 'testIndexConfig'
        , config: {
              type: 'fulltext'
            , provider: 'lucene'
          }
      };

      db.createNodeIndex('testing', indexSettings, done);
    });

    it('should be able to delete a node index', function(done) {
      var testIndex = 'testIndexDelete';

      db.createNodeIndex(testIndex, function() {
        db.deleteNodeIndex(testIndex, done);
      });
    });

    it('should be able to list node indexes', function(done) {
      db.createNodeIndex('testIndexListing', function() {
        db.listNodeIndexes(function(err, nodeIndexes) {
          var indexNames = nodeIndexes.map(function(index) { return index.name});

          indexNames.should.include('testIndexListing');
          done();
        });
      });
    });

    it('should be able to add a node to an index', function(done) {
      db.insertNode({name:'fööbar'}, function(err, node) {
        var indexItem = {
            value: 'IndexItem'
          , key: 'important'
          , uri: node.self
        };

        db.addNodeToIndex('testIndexNodeInsert', indexItem, function(err, result) {
          console.log(err, result);
          done();
        });
      });
    });
  })
})