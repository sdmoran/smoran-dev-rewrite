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

router.get('/add_project', devOnly, (req, res) => {
    res.render("admin/add_project")
})

router.get('/all_projects', devOnly, (req, res) => {
    API.getAllProjects()
    .then(projects => {
        res.render("admin/all_projects", { projects })
    })
})

router.get('/', devOnly, (req, res) => {
    res.render("admin/dashboard")
})

router.post('/add_project', devOnly, (req, res) => {
    // TODO instead of this, store files in MongoDB or S3 or something so they're find-able later
    const imgPath = process.env.IMAGE_DIR + req.files.image.name;
    fs.writeFile(imgPath, req.files.image.data, (err) => {
        if(err) {
            console.log("An error occured!", err);
        }
        else {
            console.log(`Wrote image to ${imgPath}`)
        }
    })

    // Once image is written, try to upload it to S3
    API.uploadImage(imgPath)
    .then(url => {
        console.log("UPloaded image URL: ", url)
        // Add name of uploaded image to project data so it will be visible on project page
        const project = req.body;
        req.body.images = []
        req.body.images.push(url)

        API.addProject(project)
        .then(() => {
            res.redirect('/all_projects')
        })
    })


})

module.exports = router