// AWS credentials read automatically from environment variables
const AWS = require("aws-sdk")
const MongoClient = require('mongodb').MongoClient;

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_URL = process.env.DB_URL;

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/smoran-dev?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect();

const getAllProjects = function() {
    return new Promise((resolve, reject) => {
        return client.db("smoran-dev").collection("projects").find({}).toArray((err, result) => {
            if(err) reject(err);
            resolve(result);
        })
    })
}

const getProject = function(projectname) {
    return new Promise((resolve, reject) => {
        return client.db("smoran-dev").collection("projects").findOne({name: projectname}).then((result) => {
            if(result) resolve(result);
            reject(result);
        }).catch(e => {
            reject(e);
        })
    })
}

const addProject = function(project) {
    return new Promise((resolve, reject) => {
        return client.db("smoran-dev").collection("projects").insert(project).then((result) => {
            if(result) resolve(result);
            reject(result);
        }).catch(e => {
            reject(e);
        })
    })
}

const uploadImage = function(fname) {
    return new Promise((resolve, reject) => {
        s3 = new AWS.S3({apiVersion: '2020-12-28'});
        const uploadParams = {Bucket: "smoran.dev-media", Key: '', Body: ''};
        var fs = require('fs');
        const file = fname;
        var fStream = fs.createReadStream(file);
        uploadParams.Body = fStream;
        var path = require('path');
        uploadParams.Key = "images/" + path.basename(file);
    
        s3.upload (uploadParams, function (err, data) {
            if (err) {
              console.log("Error", err);
              reject(err);
            } if (data) {
              console.log("Upload Success", data.Location);
              resolve(data.Location);
            }
          });
    })
}

exports.getProject = getProject;
exports.getAllProjects = getAllProjects;
exports.addProject = addProject;
exports.uploadImage = uploadImage;