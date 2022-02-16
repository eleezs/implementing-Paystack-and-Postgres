const express = require('express');
const Sequelize = require('sequelize');
const app = express();
const path = require('path');
const request = require('request');
const _ = require('lodash');
const db = require('./models');
const { doesNotReject } = require('assert');
const { user } = require('pg/lib/defaults');
require('dotenv').config()
const {initializePayment, verifyPayment} = require('./config/paystack')(request);

app.use(express.json());
app.use(express.urlencoded ({extended: false }));
// app.use(express.static(path.join(__dirname, 'public/')));
app.set('view engine', "ejs")

// connect to DB
const sequelize = new Sequelize ( 
  'paystackdb', 
  'postgres', 
  process.env.DB_PWD, 
  {
    host: 'localhost',
    dialect: 'postgres'
  }
)
sequelize.authenticate().then(() =>{
  console.log('Database Connected Successfully')
}).catch((error) => {
  console.log('Database Connection Failed', error)
});

app.get('/', (req, res) => {
  res.render('index.ejs')
});
app.get('/error', (req, res) => {
  res.render('error.ejs')
});

app.post('/api/paystack/payment', (req, res) => {
  const form = _.pick(req.body, ['name', 'email', 'amount']);
  form.metadata= {
    name: form.name
  }
  form.amount*=100;
  initializePayment(form, (error, body) => {
    if (error) {
      console.log(error)
      return res.redirect('/error');
    }
     response = JSON.parse(body);
     console.log(response)
    res.redirect(response.data.authorization_url)
  });
});

app.get('/paystack/callback', async(req, res) => {
  try {
    const ref = req.query.reference;
    console.log(ref)
   verifyPayment(ref, (error, body) =>{
    if(error) {
      console.log(error)
      // return res.redirect('/error')
    }
    response =JSON.parse(body);
    console.log(response)

    const_data = _.at(response.data, ['reference', 'amount','customer.email','metadata.name']);
    console.log(const_data)
    let data = [reference, amount, email, name];
    let newUser = db.User.create({
      name: name,
      email: data.email,
      amount: amount,
      reference: reference
    })
    if(newUser){
      res.redirect('/receipt/'+user._id)
    }
  })
  }
  catch(error) {
    console.log(error)
    res.redirect('/error')
  }
});

app.get('/reciept/:id', async(req, res) => {
  const id = req.params.id;
  db.findByPk.then((user) =>{
    if(!user) {
      res.redirect('/error')
    }
    res.render('success.ejs',{user})
  }).catch((err)=>{
    res.redirect('/error')
  })

})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
