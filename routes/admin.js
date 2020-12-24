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
    console.log(req.body)
    // API.addProject(req.body)
    // .then(() => {
    //     res.redirect('all_projects')
    // })
    res.redirect('all_projects')
})

module.exports = router