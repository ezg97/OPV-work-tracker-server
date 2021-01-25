require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const keys = require('./keys');
const UserService = require('./passport-setup-service');
const knex = require('knex');
const { DB_URL } = require('../config');

const db = knex({
    client: 'pg',
    connection: DB_URL,
  });

//Serialize the user id
passport.serializeUser( (user, done) => {
    console.log('in serialize');
    console.log(' -> ', user.user_email);
    done(null, user.user_email);//id in the database
});

passport.deserializeUser( (email, done) => {
    //find the user id in the database
    console.log('in DEserialize **');
    console.log(' -> ', email);

    //console.log('email: ', email);
    //Locating the user in the database
    UserService.hasUserWithEmail(
        db,
        email,
    )
    .then(userInfo => {
        console.log("USER INFO -> ",userInfo);
        //console.log('returned from service: ', userInfo);
        //If the user exists then pass into the callback function, else, pass in empty object
        if(userInfo) done(null, userInfo);
        else done(null,{});
    })
    .catch (err => {
        console.error('ERROR THROWN trying to access database: ', err);
    });
});

passport.use(
    new GoogleStrategy({
        //options for the google strategy
        callbackURL: '/auth/rggl/redirect',
        failureRedirect: 'https://opv.elijahguerrero97.vercel.app/', // see text
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        //passport call back function
        console.log('info returned from Google API');
        //check if user exists in database
        UserService.hasUserWithEmail(db, profile._json.email).then(currentUser => {
            //If the user is in the database then pass them into the callback function
            console.log('FROM DB: current user: ',currentUser);
            console.log('from login: profile',profile.id);
            if (currentUser) {
                //console.log('USING USER');
                
                //compare the ID that the user in the database has with the ID
                return UserService.compareIds(profile.id, currentUser.user_id)
                    .then(compareMatch => {
                        console.log('current match ->',currentUser);
                        //if the password doesn't match
                        //if (compareMatch) {
                            //Call the callback function
                            //no if, because if they matched I could send the below, but if they dont match then I would need to grab every account with this email
                            // and check each password... doable, but i'm not gonna do that right now!
                            if (currentUser.user_email !== 'oilsporvida@gmail.com') {
                                console.log('--- failed in signing');

                                done(null,false);
                            }
                            done(null, currentUser);
                       // }
                      //  else {
                        //    done(null, {});
                      //   }
                });
            }
            else {
                console.log('CREATING USER');
                console.log(profile._json.email);

                    
                UserService.hashId(profile.id)
                    .then(hashedId => {

                        const user = { 
                            // user_name: profile.displayName,
                            user_id: hashedId,
                            user_email: profile._json.email
                        }
                        if (user.user_email !== 'oilsporvida@gmail.com') {
                            console.log('--- failed in creating');
                            done(null,false);
                        }
                                                    
                         // Add user to database
                        UserService.addUser(db, user).then(newUser => {                
                            //Call the callback function
                             done(null,newUser);
                        });
                });
            }
        });
        //if exists, retrieve info

    
    })
);