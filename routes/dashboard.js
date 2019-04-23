const express = require('express');
const stringtags = require('striptags');
const momont = require('moment');

const router = express.Router();
const firebaseAdminDb = require('../connection/firebase_admin');

const categoriesRef = firebaseAdminDb.ref('/categories/');
const articlesRef = firebaseAdminDb.ref('/articles/');

router.get('/archives', (req, res, next) => {
  const status = req.query.status || 'public';
  let categories = {};
  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    return articlesRef.orderByChild('update_time').once('value');
  }).then((snapshot) => {
    const archives = [];
    snapshot.forEach((snapshotChild) => {
      if (snapshotChild.val().status === status) {
        archives.push(snapshotChild.val());
      }
    });
    archives.reverse();
    res.render('dashboard/archives', {
      title: '123',
      archives,
      categories,
      stringtags,
      momont,
      status,
    });
  });
});

router.get('/article/created', (req, res, next) => {
  categoriesRef.once('value').then((snapshot) => {
    const categories = snapshot.val();
    res.render('dashboard/article', {
      title: 'Express',
      categories,
    });
  });
});

router.get('/article/:id', (req, res, next) => {
  const id = req.param('id');
  let categories = {};
  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    return articlesRef.child(id).once('value');
  }).then((snapshot) => {
    const article = snapshot.val();
    res.render('dashboard/article', {
      title: 'Express',
      categories,
      article,
    });
  });
});

router.post('/article/delete/:id', (req, res, next) => {
  const id = req.param('id');
  articlesRef.child(id).remove();
  req.flash('info', '欄位已刪除。');
  res.send('文章已刪除');
  res.end();
});


router.post('/article/created', (req, res, next) => {
  const data = req.body;
  const articleRef = articlesRef.push();
  const upDateTime = Math.floor(Date.now() / 1000);
  data.id = articleRef.key;
  data.update_time = upDateTime;
  articleRef.set(data).then(() => {
    res.redirect(`/dashboard/article/${data.id}`);
  });
});

router.post('/article/update/:id', (req, res, next) => {
  const data = req.body;
  const id = req.param('id');
  const upDateTime = Math.floor(Date.now() / 1000);
  data.upDateTime = upDateTime;
  articlesRef.child(id).update(data).then(() => {
    res.redirect(`/dashboard/article/${id}`);
  });
});

router.get('/categories', (req, res, next) => {
  const messages = req.flash('info');
  categoriesRef.once('value').then((snapshot) => {
    const categories = snapshot.val();
    res.render('dashboard/categories', {
      title: '分類管理',
      categories,
      hasInfo: messages.length > 0,
      messages,
    });
  });
});

router.post('/categories/created', (req, res, next) => {
  const data = req.body;
  const categoryRef = categoriesRef.push();
  data.id = categoryRef.key;
  categoriesRef.orderByChild('path').equalTo(data.path).once('value')
    .then((snapshot) => {
      if (snapshot.val() !== null) {
        req.flash('info', '路徑已有相同存在。');
        res.redirect('/dashboard/categories');
      } else {
        categoryRef.set(data).then(() => {
          res.redirect('/dashboard/categories');
        });
      }
    });
});

router.post('/categories/delete/:id', (req, res, next) => {
  const id = req.param('id');
  categoriesRef.child(id).remove();
  req.flash('info', '欄位已刪除。');
  res.redirect('/dashboard/categories');
});

module.exports = router;
