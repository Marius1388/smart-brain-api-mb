require('dotenv').config();
const jwt = require('jsonwebtoken');
const redis = require('redis');

//setup Redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized');
    } 
    return res.json( {id: reply} )
  })
}

const signToken = (email) => {
    const jwtPayload = {email};
    return jwt.sign(jwtPayload,process.env.JWTSECRET, {expiresIn: '2days'})
}

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
}

const createSession = (user) => {
  // JWT token, return user data
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => { 
      return { success: 'true', userId: id, token } 
    })
    .catch(err => err);
}

const deleteToken = (key) => {
  return Promise.resolve(redisClient.del(key))
}

const deleteCurrentUserSession = (authorization) => {
  return deleteToken(authorization)
        .then(() => {
          return {signoutSuccess: 'true'}
        })
        .catch(console.log)
}


module.exports = {
	getAuthTokenId: getAuthTokenId,
	signToken: signToken,
	setToken: setToken,
  createSession: createSession,
  deleteCurrentUserSession: deleteCurrentUserSession
}