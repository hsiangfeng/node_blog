const express = require('express');

const firebaseClient = require('../connection/firebase_client');

const firebaseAuth = firebaseClient.auth();
const router = express.Router();


router.post('/signup', (req, res, next) => {
  console.log(req.body);
  const account = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirm_password,
  };
  if (account.password === account.confirmPassword) {
    firebaseAuth.createUserWithEmailAndPassword(account.email, account.password);
    console.log('註冊成功');
  } else {
    console.log('密碼不相同');
  }
  // firebaseClient.auth().createUserWithEmailAndPassword();
  res.render('dashboard/signup', {
    title: '123',
  });
});


router.get('/signup', (req, res, next) => {
  res.render('dashboard/signup', {
    title: '123',
  });
});

router.post('/signin', (req, res, next) => {
  const account = {
    email: req.body.email,
    password: req.body.password,
  };
  firebaseAuth.signInWithEmailAndPassword(account.email, account.password)
    .then((response) => {
      console.log(response);
      console.log(response.user.uid);
      req.session.uid = response.user.uid;
      res.redirect('/dashboard/archives');
    })
    .catch((error) => {
      console.log(error);
      res.redirect('/dashboard/signin');
    });
});

router.get('/signin', (req, res, next) => {
  res.render('dashboard/signin', {
    title: '123',
  });
});

module.exports = router;
