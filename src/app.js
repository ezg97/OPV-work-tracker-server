require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const foldersRouter = require('./folders/folders-router')
const notesRouter = require('./notes/notes-router');
const emailRouter = require('./email/email-router');


const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(function tableHeader(req, res, next){
    //grab the table from the header
    console.log( req.get('folderid'));
    const folder = req.get('folderid');
    console.log('folderrrrrr:', folder);
    if (folder !== undefined) { 
        app.set('folder', folder); }
    else{
        console.log('not saved to folderrrrr');
    }
    
    
        // move to the next middleware
    next();
  });

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use('/api/folders', foldersRouter);
app.use('/api/notes', notesRouter);
app.use('/api/notes', emailRouter);
app.use('/api/email', emailRouter);


app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: {message: 'server error' } }
    } else {
        console.log(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app;