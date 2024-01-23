const express = require('express');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = express();
const port = 4000;

// Firebase configuration
const serviceAccount = require('./serviceAccount.json');
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('start.ejs');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/signupsubmit', (req, res) => {
  const full_name = req.query.first_name;
  const last_name = req.query.last_name;
  const email = req.query.email;
  const password = req.query.psw;
  const rep_psw = req.query.psw_repeat;
  if (password == rep_psw) {
    db.collection('users')
      .add({
        name: full_name +" "+ last_name,
        email: email,
        password: password,
      })
      .then(() => {
        res.render('login');
      });
  } else {
    res.send('SignUP Failed');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/loginsubmit', (req, res) => {
    const email = req.query.emil;
    const password = req.query.passwrd;
    db.collection("users")
        .where("email", "==", email)
        .where("password", "==", password)
        .get()
        .then((docs) => {
            if(docs.size>0){
                var usersData = [];
                db.collection('users')
                    .get()
                    .then(() => {
                        docs.forEach((doc) => {
                            usersData.push(doc.data());
                    });
                })
                .then(() => {
                    console.log(usersData);
                    res.render('home' , {name:usersData[0].name});
                }); 
            }else{
                res.send("Login Failed");
            }
        });
 });
app.get('/index',(req,res)=>{
  res.render("index")
})
app.get('/about',(req,res)=>{
  res.render("about")
})
app.listen(port, () => {
  console.log(`Your APP is running in the port ${port}`);
});
