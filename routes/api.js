/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var bodyParser = require('body-parser');

const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
  
    .get(function (req, res){
      var project = req.params.project;
      let filterKey = req.query.filterKey;
      let filter = req.query.filter;
      let query={};
    query[filterKey]=filter;
    if(query[filterKey]==''){
       query = {};
    }
     
      MongoClient.connect(CONNECTION_STRING,{useUnifiedTopology: true,useNewUrlParser: true},(err,data)=>{
        let db = data.db('tickets');
        db.collection(project).find(query).toArray((err,doc)=>{
          if (err) throw err;
          res.json(doc);
        });
      })
    })
    
    .post(function (req, res){
    var project = req.params.project;
    let body = req.body;
    if(req.body.issue_title == '' || req.body.issue_text == '' || req.body.created_by == ''){
      res.send('REQUIRED FIELDS NOT FILLED IN');
     return;
    }
    let issue = {
      issue_title: req.body.issue_title,
      issue_text: req.body.issue_text,
      created_by: req.body.created_by,
      assigned_to: req.body.assigned_to,
      status_text: req.body.status_text,
      open: true,
      date_created: new Date(),
      date_updated: new Date()
    }
    
    MongoClient.connect(CONNECTION_STRING, {useUnifiedTopology: true,useNewUrlParser: true},function(err, data) { 
      let db = data.db('tickets');
      db.collection(project).insertOne(issue,(err,doc)=>{
          if (err) throw err;
          res.json(doc.ops[0]);
        });
      });
    })
    
    .put(function (req, res){
      var project = req.params.project;
  
    if(req.body._id == undefined){
       res.send('No Fields Updated!');
       return;
     }
    let body = req.body;
    MongoClient.connect(CONNECTION_STRING, {useUnifiedTopology: true,useNewUrlParser: true},function(err, data) { 
      let db = data.db('tickets');
      db.collection(project).findOne({_id:ObjectId(req.body._id)},(err,data)=>{
        if (err) throw err;
        let oldData = data;
         for(let keys in oldData){
           if(body[keys]==null || body[keys] == ''){
             body[keys] = oldData[keys];
           }
         }
        body.date_updated = new Date();
      db.collection(project).findOneAndUpdate({_id:ObjectId(req.body._id)},{$set:{issue_title: body.issue_title,issue_text:body.issue_text,
                                                                    created_by:body.created_by, assigned_to:body.assigned_to,
                                                                   status_text:body.status_text,date_updated:body.date_updated,open:body.open}},
                                                                    {upsert:true, returnNewDocument:true},(err,doc)=>{
          if (err) throw err;
          res.json(doc.value);
        });
      });
       });
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      let id = req.body._id;
      if(id == ''){
        res.send('_id error!');
        return;
      }
      MongoClient.connect(CONNECTION_STRING,{useUnifiedTopology: true,useNewUrlParser: true},(err,data)=>{
        let db = data.db('tickets');
        db.collection(project).deleteOne({_id:ObjectId(id)},(err,doc)=>{
          if(err){
            res.send('could not delete ' + id);
            throw err;
          }
          
          res.send(`${id} deleted.`);
        })
        
      })
    });
    
};
