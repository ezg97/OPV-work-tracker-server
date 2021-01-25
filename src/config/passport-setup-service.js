const bcrypt = require('bcryptjs');
const xss = require('xss');


const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UserService = {
    //checking to see if a user with the user_id exists in the database.
    hasUserWithUserId(db, user_id) {
        return db
            .from('users')
            .where('user_id', user_id)
            .first()
            .then(user => user)
    },
    hasUserWithEmail(db, email) {
      return db
          .from('users')
          .where('user_email', email)
          .first()
          .then(user => user)
  },
    addUser(db, newUser) {
        return db
          .insert(newUser)
          .into('users')
          .returning('*')
          .then(([user]) => user)
    },
    validatePassword(password) {
        if (password.length < 8) {
          return 'Password be longer than 8 characters'
        }
        if (password.length > 72) {
          return 'Password be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
          return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
          return 'Password must contain one upper case, lower case, number and special character'
        }
        return null
    },
    hashId(id) {
        return bcrypt.hash(id, 12)
    },
    compareIds(id, hash) {
      return bcrypt.compare(id, hash)
    },
    serializeUser(user) {
        return {
          id: user.id,
          business_name: xss(user.business_name),
          business_password: xss(user.business_password),
          //nickname: xss(user.nick_name),
         // date_created: new Date(user.date_created),
        }
      },
    
};

module.exports = UserService;
