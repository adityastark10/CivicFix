const path = require('path');
const express = require('express');

const authRoutes = require('./routes/auth.routes');
const indexRoutes = require('./routes/index.routes');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Global template variables
app.use((req, res, next) => {
  res.locals.appName = 'CivicFix';
  res.locals.currentYear = new Date().getFullYear();
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/', indexRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).render('pages/404', {
    pageTitle: 'Page Not Found',
    path: req.originalUrl
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[CivicFix Error]:', err);
  res.status(500).render('pages/500', {
    pageTitle: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

module.exports = app;
