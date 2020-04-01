const { createSession } = require('../services/createSession');
const redis = require('redis'); 
//setup redis
const redisClient = redis.createClient(process.env.REDIS_URI)

const handleRegister = (db, bcrypt, req, res) => {
    const { email, name, pet, age, password } = req.body;
    // console.log("printing email and name: .. "+email, name)
    if (!email || !name || !password) {
      return Promise.reject('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
      return db.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name: name,
              age: age,
              pet: pet,
              joined: new Date()
            })
            .then(user => user[0])
            .catch(err => Promise.reject('1.Unable to register'))
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => Promise.reject('2.Unable to register'))
  }
   
  const registerAuthentication = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    return authorization ? getAuthTokenId(req, res) :
      handleRegister(db, bcrypt, req, res)
      .then(data => {
        return data.id && data.email ? createSession(data) : Promise.reject(data);
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err))
  }
  
  module.exports = {
    registerAuthentication: registerAuthentication,
    redisClient: redisClient
  };