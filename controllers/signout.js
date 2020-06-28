const { deleteCurrentUserSession } = require('../services/createSession');

const handleSignout = (req, res) => {
  const {Authorization} = req.body;
  if (Authorization ){
    return deleteCurrentUserSession(Authorization) 
          .then(resp => res.json(resp))
          .catch(err => res.status(400).json(err))
  } 
  res.status(400).json("Unauthorized")
  
}

module.exports = {
	handleSignout: handleSignout
}