require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const foldersRouter = require('./folders/folders-router')
const notesRouter = require('./notes/notes-router');
const emailRouter = require('./email/email-router');
const authRoutes = require('./auth/auth-routes');

const passportSetup = require('./config/passport-setup');


const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');


//  --- middleware ---
const app = express();
var bodyParser = require('body-parser');

// app.set('trust proxy', 1); // trust first proxy


const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet());
app.use(cors({
    origin : 'https://opv.elijahguerrero97.vercel.app',//localhost:3000 (Whatever your frontend url is) 
    credentials: true, // <= Accept credentials (cookies) sent by the client
  }));

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  //makes sure the cookie is just a day long
app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [keys.session.cookieKey],
    // sameSite: 'None',
    // sameSite: 'none',
    httpOnly: true,
    // secure: true,
  }));
  
  //init passport
  app.use(passport.initialize());
  app.use(passport.session());



app.use(function tableHeader(req, res, next){
    //grab the table from the header
    console.log('req: ',req.user);
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

  console.log('bout to the auth routes');
  app.use('/auth', authRoutes);


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