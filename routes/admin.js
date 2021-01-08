const fs = require('fs');

const express = require('express')
const router = express.Router()
const API = require("../db/API")
const mode = process.env.MODE || "prod";

const devOnly = function(req, res, next) {
    if(mode != "dev") {
        res.render("pages/404")
    }
    else {
        next()
    }
}

// Receives a project object and the contents of a request's
// files field. Writes all files to local storage, then uploads them
// to S3 and writes the object URLs to the project's 'images' field.
function handleFileUpload(project, files) {
    return new Promise( (resolve, reject) => {
        if(files) {
            const numKeys = Object.keys(files).length;
            let count = 0;
            Object.keys(files).forEach(key => {
                const imgPath = process.env.IMAGE_DIR + files[key].name;
                console.log(imgPath);
                fs.writeFile(imgPath, files[key].data, (err) => {
                    if(err) {
                        console.log("An error occured!", err);
                        reject(err);
                    }
                    else {
                        console.log(`Wrote image to ${imgPath}`)
                    }
                })
            
                // Once image is written, try to upload it to S3
                API.uploadImage(imgPath)
                .then(url => {
                    console.log("Uploaded image URL: ", url)
                    // Add name of uploaded image to project data so it will be visible on project page
                    project.images.push(url)
                    count++;
                })
                .catch( e => {
                    reject(e);
                })
                .finally( () => {
                    // Make sure we upload ALL images before resolving.
                    if(count == numKeys) {
                        resolve();
                    }
                })
            })
        } 
        else {
            resolve();
        }
    })
}

router.get('/add_project', devOnly, (req, res) => {
    res.render("admin/edit_project", { 
        project: {},
        edit: false 
    })
})

router.get('/all_projects', devOnly, (req, res) => {
    API.getAllProjects()
    .then(
        projects => {
            if(projects) {
                res.render("admin/all_projects", { projects })
            }
            else {
                res.render("pages/404")
            }
        }
    )
})

router.get('/projects/edit/:projectID', devOnly, (req, res) => {
    const projectID = req.params.projectID;
    API.getProjectByID(projectID)
    .then(
        project => {
            if(project) {
                res.render("admin/edit_project", { project, edit: true })
            }
            else {
                res.render("pages/404")
            }
        }
    )
    .catch(
        e => {
            res.render("pages/404")
        }
    )
})

router.get('/', devOnly, (req, res) => {
    res.render("admin/dashboard")
})

router.post('/add_project', devOnly, (req, res) => {
    // Write image to local storage so it can be uploaded to S3
    const project = req.body;
    // Encoded as JSON array because FormData will comma-separate array elements otherwise
    project.paragraphs = JSON.parse(req.body.paragraphs);
    project.images = []

    // IIFEs are cool! Upload images (if any) to S3, then resolve promise and add project to db.
    handleFileUpload(project, req.files)
    .then(() => {
        API.addProject(project)
        .then(() => {
            res.redirect('/all_projects')
        })
    })
})

router.post('/projects/edit/:projectID', devOnly, (req, res) => {
    const projectID = req.params.projectID;
    const project = req.body;
    project.paragraphs = JSON.parse(req.body.paragraphs);

    if(!project.images) {
        project.images = []
    }
    else {
        console.log("IMAGES:");
        console.log(project.images);
    }

    handleFileUpload(project, req.files)
    .then(() => {
        API.updateProject(projectID, project);
        res.redirect('/all_projects');
    })

})

router.post('/projects/delete/:projectID', devOnly, (req, res) => {
    const projectID = req.params.projectID;
    API.deleteProject(projectID)
    .then(() => {
        res.send("Deleted project!")
    })
    .catch(
        (e) => {
            res.send(`Failed to delete project! Error: ${e}`)
        }
    )
})

module.exports = router