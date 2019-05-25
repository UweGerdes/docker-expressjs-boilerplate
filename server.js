/**
 * ## HTTP-Server for boilerplate
 *
 * @module server
 */

'use strict';

const bodyParser = require('body-parser'),
  chalk = require('chalk'),
  cookieParser = require('cookie-parser'),
  dateFormat = require('dateformat'),
  express = require('express'),
  session = require('express-session'),
  glob = require('glob'),
  i18n = require('i18n'),
  MemoryStore = require('memorystore')(session),
  morgan = require('morgan'),
  path = require('path'),
  config = require('./lib/config'),
  ipv4addresses = require('./lib/ipv4addresses'),
  log = require('./lib/log'),
  app = express(),
  server = require('http').createServer(app);

let routers = { };

/**
 * Weberver logging
 *
 * using log format starting with [time]
 */
if (config.server.verbose) {
  morgan.token('time', () => {
    return dateFormat(new Date(), 'HH:MM:ss');
  });
  app.use(morgan('[' + chalk.gray(':time') + '] ' +
    ':method :status :url :res[content-length] Bytes - :response-time ms'));
}

// Serve static files
app.use(express.static(config.server.docroot));
app.use('/jsdoc', express.static(config.gulp.build.jsdoc.dest));

/**
 * Routes from modules
 */
glob.sync(config.server.modules + '/*/server/index.js')
  .forEach((filename) => {
    const regex = new RegExp(config.server.modules + '(/[^/]+)/server/index.js');
    const baseRoute = filename.replace(regex, '$1');
    routers[baseRoute] = require(filename);
  });

// base directory for views
app.set('views', __dirname);

// render ejs files
app.set('view engine', 'ejs');

// work on post requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// work on cookies
app.use(cookieParser());

// set up i18n
i18n.configure({
  defaultLocale: 'de',
  directory: config.gulp.build.locales.dest,
  autoReload: true,
  updateFiles: false,
  cookie: 'lang',
  queryParameter: 'lang'
});
app.use(i18n.init);
app.use((req, res, next) => {
  if (req.query.lang) {
    res.cookie('lang', req.query.lang, { maxAge: 900000, httpOnly: true });
  } else if (!res.cookie.lang) {
    const lang = req.acceptsLanguages(...Object.keys(i18n.getCatalog()));
    if (lang) {
      i18n.setLocale(lang);
    }
  }
  next();
});

// initialize req.session
app.use(session({
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: 'uif fsranöaiorawrua vrw',
  resave: false,
  saveUninitialized: true
}));

/**
 * use express in modules
 */
for (const router of Object.values(routers)) {
  if (router.useExpress) {
    router.useExpress(app);
  }
}

/**
 * Route for root dir
 *
 * @param {Object} req - request
 * @param {Object} res - response
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(config.server.docroot, 'index.html'));
});

/**
 * Route for app main page
 *
 * @param {Object} req - request
 * @param {Object} res - response
 */
app.get('/app', (req, res) => {
  res.render(viewPath('app'), config.getData(req));
});

/**
 * Route for i18n ejs test page
 *
 * @param {Object} req - request
 * @param {Object} res - response
 */
app.get('/i18n-ejs', (req, res) => {
  res.render(viewPath('i18n-test'), config.getData(req));
});

// Fire it up!
server.listen(config.server.httpPort);
server.on('error', onError);
server.on('listening', onListening);

/**
 * connect server and use routes from modules
 */
for (const [baseRoute, router] of Object.entries(routers)) {
  if (router.connectServer) {
    router.connectServer(server);
  }
  app.use(baseRoute, router.router);
}

/**
 * Route for everything else
 *
 * @param {Object} req - request
 * @param {Object} res - response
 */
app.get('*', (req, res) => {
  res.status(404).render(viewPath('error'), Object.assign({
    error: {
      code: 404,
      name: 'not found'
    }
  }, config.getData(req)));
});

/**
 * Handle server errors
 *
 * @param {Object} err - error
 * @param {Object} req - request
 * @param {Object} res - response
 * @param {Object} next - needed for complete signature
 */
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  if (err) {
    res
      .status(500)
      .render(viewPath('error'), Object.assign({
        error: {
          code: 500,
          name: 'server error',
          error: err
        }
      }, config.getData(req)));
  } else {
    next();
  }
});

/**
 * Get the path for file to render
 *
 * @private
 * @param {String} page - page type
 * @param {String} type - file type (ejs, jade, pug, html)
 */
function viewPath(page = 'error', type = 'ejs') {
  return config.server.modules + '/pages/views/' + page + '.' + type;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(config.server.httpPort + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(config.server.httpPort + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  log.info('server listening on ' +
    chalk.greenBright('http://' + ipv4addresses.get()[0] + ':' + config.server.httpPort));
}
