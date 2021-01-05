// Express and middleware
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')

const app = express();
const port = process.env.PORT || 3000;
const mode = process.env.MODE || "prod";
const API = require('./db/API')

const projectRoutes = require('./routes/projects');
const adminRoutes = require('./routes/admin');

// Set environment variable for uploaded images. Used in admin module.
process.env.IMAGE_DIR = __dirname + "/files/images/"

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(fileUpload({
    createParentPath: true
}))

app.use('/files', express.static('files'));
app.use('/projects', projectRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    API.getAllProjects().then(projects => {
        // Get 3 random projects
        const selected = projects.sort(() => 0.5 - Math.random()).slice(0, 3)
        res.render('pages/index', { projects: selected });
    })
    .catch(e => {
        console.log(e);
        res.render('pages/404');
    })
});

app.get('*', (req, res) => {
    res.render('pages/404')
});

// Stop EJS from dumping errors directly to users in production
function gracefulRenderError(err, req, res, next) {
    // EJS render errors are TypeError
    if (err instanceof TypeError) {
        console.log(err)
        // In dev mode, show error
        if(mode === "dev") {
            next(err);
        }
        else {
            // In prod, hide!
            res.render('pages/error')
        }
    }
}

app.use(gracefulRenderError);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})