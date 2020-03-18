const express =require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const bcrypt= require('bcrypt-nodejs');
const cors =require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin =require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    // connection: {
    //   // !!!!! commented lines are for deployment use only!!!!
    //   // connectionString: process.env.DATABASE_URL,
    //   // host : 'postgresql-animated-50501',
    //   host : process.env.POSTGRES_HOST,
    //   user : process.env.POSTGRES_USER,
    //   password : process.env.POSTGRES_PASSWORD,
    //   database : process.env.POSTGRES_DB
    //   // ssl: true
    // }
    
    connection: process.env.POSTGRES_URI
  });


const app = express();
// console.log('when?');
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

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


app.listen( 3000 || process.env.PORT, ()=> {
    console.log(`server is running on port 3000 or ${process.env.PORT}`);
})