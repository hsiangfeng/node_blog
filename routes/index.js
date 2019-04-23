const express = require('express');
const stringtags = require('striptags');
const momont = require('moment');

const router = express.Router();
const firebaseAdminDb = require('../connection/firebase_admin');
const converPagination = require('../modules/convertPagination');

const articleRef = firebaseAdminDb.ref('/articles/');
const categorieRef = firebaseAdminDb.ref('/categories/');

router.get('/', (req, res, next) => {
  const currentPage = Number.parseInt(req.query.page, 0) || 1;
  let categories = {};
  categorieRef.once('value').then((snapshop) => {
    categories = snapshop.val();
    return articleRef.orderByChild('update_time').once('value');
  }).then((snapshop) => {
    const articles = [];
    snapshop.forEach((snapshopChild) => {
      if (snapshopChild.val().status === 'public') {
        articles.push(snapshopChild.val());
      }
    });
    articles.reverse();
    const data = converPagination(articles, currentPage);
    // 分頁邏輯
    res.render('index', {
      title: 'Express',
      articles: data.data,
      categories,
      page: data.page,
      momont,
      stringtags,
    });
  });
});

router.get('/post/:id', (req, res, next) => {
  const id = req.param('id');
  let categories = {};
  categorieRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    return articleRef.child(id).once('value');
  }).then((snapshot) => {
    const article = snapshot.val();
    res.render('post', {
      title: 'Express',
      categories,
      article,
      momont,
    });
  });
});

router.get('/dashboard/signup', (req, res, next) => {
  res.render('dashboard/signup', { title: 'Express' });
});

module.exports = router;
