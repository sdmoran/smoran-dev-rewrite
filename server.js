const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const API = require('./db/API')

const projectRoutes = require('./routes/projects');

app.set('view engine', 'ejs');

app.use('/files', express.static('files'));
app.use('/projects', projectRoutes);

app.get('/', (req, res) => {
    API.getAllProjects().then(projects => {
        res.render('pages/index', { projects });
    })
    .catch(e => {
        console.log(e);
        res.render('pages/404');
    })
});

app.get('*', (req, res) => {
    res.render('pages/404')
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})