/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          //assert.equal()
          //fill me in too!
          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          _id:'5d5c800c269ece277bf336f6',
          issue_title:'Titles!',
          issue_text:'Texts!',
          created_by:'DD!',
          assigned_to:'',
          status_text:''
        })
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.body.issue_title,'Titles!');
          assert.equal(res.body.issue_text,'Texts!');
          assert.equal(res.body.created_by,'DD!');
          assert.equal(res.body.assigned_to,'');
          assert.equal(res.body.status_text,'');
         done();
        })
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title:'',
          issue_text:'',
          created_by:'',
          assigned_to:'BJ',
          status_text:'Open'
        })
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,'REQUIRED FIELDS NOT FILLED IN');
         done();
        })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text,'No Fields Updated!');
          done();
      });
      });
      
   test('One field to update', function(done) {
         chai.request(server)
        .put('/api/issues/test')
        .send({
          _id:'5d606969a2d1843aa2128218',       
          issue_text:'Found the issue was a clogged drain, literal cat found in drain. Waiting for cat removal.',
        })
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.body.issue_text,'Found the issue was a clogged drain, literal cat found in drain. Waiting for cat removal.');
         done();
        })
      });
      
   test('Multiple fields to update', function(done) {
         chai.request(server)
        .put('/api/issues/test')
        .send({
           _id:'5d606a783647123bf1bda198',
          issue_text:'Found rat stuck in barn door. Apparently rat is owned by Carl Jr, will be sending Carl instead of BJ.',
          assigned_to:'Carl Jr',
        })
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.body.issue_text,'Found rat stuck in barn door. Apparently rat is owned by Carl Jr, will be sending Carl instead of BJ.');
          assert.equal(res.body.assigned_to,'Carl Jr');
         done();
        })
      });
    
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'date_created');
          assert.property(res.body[0], 'date_updated');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title:'Title'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.propertyVal(res.body[0],'issue_title', 'Title');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
          chai.request(server)
        .get('/api/issues/test')
        .query({issue_title:'Title',status_text:'In QA'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.propertyVal(res.body[0],'issue_title', 'Title');
          assert.propertyVal(res.body[0],'status_text','In QA');
          done();
        })
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id:''
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text,'_id error!');
          done();
        })
      });
      
      test('Valid _id', function(done) {
          chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id:'5d5f0ce21d143413f676c8bf'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text,'5d5f0ce21d143413f676c8bf deleted.');
          done();
        })
      });
      
    });

});
