// AWS credentials read automatically from environment variables
const AWS = require("aws-sdk")
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
const AWS_BUCKET = process.env.AWS_BUCKET;


const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/smoran-dev?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect();

const getAllProjects = function() {
    return new Promise((resolve, reject) => {
        client.db(DB_NAME).collection("projects").find({}).toArray((err, result) => {
            if(err) reject(err);
            resolve(result);
        })
    })
}

const getProject = function(projectname) {
    return new Promise((resolve, reject) => {
        client.db(DB_NAME).collection("projects").findOne({name: projectname}).then((result) => {
            if(result) resolve(result);
            reject(result);
        }).catch(e => {
            reject(e);
        })
    })
}

const getProjectByID = function(id) {
    return new Promise((resolve, reject) => {
        const objectId = new ObjectID(id);
        client.db(DB_NAME).collection("projects").findOne({'_id': objectId}).then((result) => {
            if(result) resolve(result);
            reject(result);
        }).catch(e => {
            reject(e);
        })
    })
}

const addProject = function(project) {
    return new Promise((resolve, reject) => {
        client.db(DB_NAME).collection("projects").insertOne(project).then((result) => {
            if(result) resolve(result);
            reject(result);
        }).catch(e => {
            reject(e);
        })
    })
}

const updateProject = function(projectID, project) {
    const objectId = new ObjectID(projectID)
    return new Promise((resolve, reject) => {
        client.db(DB_NAME).collection("projects")
        .updateOne({'_id': objectId}, 
        {
            $set: {
                name: project.name,
                class: project.class,
                blurb: project.blurb,
                paragraphs: project.paragraphs,
                images: project.images
            },
        },
        { 
            upsert: true
        })
        .then((result) => {
            if(result) resolve(result);
            reject();
        })
        .catch(e => {
            reject(e);
        })
    })
}

const deleteProject = function(projectID) {
    const objectId = new ObjectID(projectID)
    return new Promise((resolve, reject) => {
        client.db(DB_NAME).collection("projects")
        .deleteOne({'_id': objectId})
        .then( result => {
            resolve(result)
        })
        .catch( e => {
            reject(e);
        })
    })
}

const uploadImage = function(fname) {
    return new Promise((resolve, reject) => {
        s3 = new AWS.S3({apiVersion: '2020-12-28'});
        const uploadParams = {Bucket: AWS_BUCKET, Key: '', Body: ''};
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
exports.getProjectByID = getProjectByID;
exports.getAllProjects = getAllProjects;
exports.addProject = addProject;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;
exports.uploadImage = uploadImage;