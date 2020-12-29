const express = require('express')
const router = express.Router()
const API = require("../db/API")

router.get('/all', (req, res) => {
    const projects = API.getAllProjects().then((projects) => {
        res.render("pages/project_home", { projects })
    })
    .catch(() => {
        res.render("pages/project_error");
    })
})

router.get('/:projectname', (req, res) => {
    const projectName = req.params.projectname;
    API.getProject(projectName).then((project) => {
        res.render("pages/project", project);
    })
    .catch(() => {
        res.render("pages/project_error");
    })
});



module.exports = router