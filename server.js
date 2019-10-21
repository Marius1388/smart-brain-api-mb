const express =require('express');
const bodyParser = require('body-parser');
const bcrypt= require('bcrypt-nodejs');
const cors =require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin =require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host: process.env.DATABASE_URL,
      // next lines are for development use only
      // host : 'postgresql-animated-50501',
      // user : 'postgres',
      // password : process.env.POSTRGRESPASSWORD,
      // database : 'smart-brain'
      ssl: true
    }
  });


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('it is working');
})

// SIGN IN ROUTE
app.post('/signin',(req,res)=>{signin.handleSignin(req,res, db, bcrypt)})

// REGISTER ROUTE
app.post('/register', (req, res) => {register.handleRegister(req,res, db, bcrypt)})

// PROFILE/:ID ROUTE
app.get('/profile/:id',(req,res) => {profile.handleProfile(req,res,db)})

//Update the user to increase their entries count, every time they submit an image

app.put('/image', (req,res) => {image.handleImage(req,res,db)})
app.post('/imageUrl', (req,res) => {image.handleApiCall(req,res)})


app.listen(process.env.PORT || 3000, ()=> {
    console.log(`server is running on port ${process.env.PORT}`);
})