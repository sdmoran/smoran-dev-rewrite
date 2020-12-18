
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

exports.getProject = getProject;

exports.getAllProjects = getAllProjects;