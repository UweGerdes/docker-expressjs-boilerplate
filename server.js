/**
 * HTTP-Server for expressjs projects
 *
 * @module server
 */

'use strict';

const bodyParser = require('body-parser'),
  chalk = require('chalk'),
  cookieParser = require('cookie-parser'),
  dateFormat = require('dateformat'),
  express = require('express'),
  createGracefulShutdownMiddleware = require('express-graceful-shutdown'),
  session = require('express-session'),
  fs = require('fs'),
  glob = require('glob'),
  https = require('https'),
  i18n = require('i18n'),
  MemoryStore = require('memorystore')(session),
  morgan = require('morgan'),
  path = require('path'),
  config = require('./lib/config'),
  ipv4addresses = require('./lib/ipv4addresses'),
  log = require('./lib/log'),
  app = express(),
  http = require('http');

const options = {
  key: fs.readFileSync(path.join(__dirname, config.server.httpsKey)),
  cert: fs.readFileSync(path.join(__dirname, config.server.httpsCert))
};
const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

let routers = { };

/**
 * Weberver logging: colored log format starting with [time]
 *
 * @name set_logformat
 */
/* c8 ignore next 7 */
if (config.server.verbose) {
  morgan.token('time', () => {
    return dateFormat(new Date(), 'HH:MM:ss');
  });
  app.use(morgan('[' + chalk.gray(':time') + '] ' +
    ':method :status :url :res[content-length] Bytes - :response-time ms'));
}

/**
 * Serve static files for base route and /jsdoc
 *
 * @name request_serve_static_files
 */
app.use(express.static(config.server.docroot));
app.use(express.static(config.server.generated));
app.use('/jsdoc', express.static(config.gulp.build.jsdoc.dest));

/**
 * Do graceful shutdown on SIGTERM signal
 *
 * @name server_graceful_shutdown
 */
app.use(createGracefulShutdownMiddleware(httpServer, { forceTimeout: 30000 }));

/**
 * Load routes from modules
 *
 * @name module_router_loader
 */
glob.sync(config.server.modules + '/*/server/index.js')
  .forEach((filename) => {
    const loadFilename = filename.replace(/^(\.\/)?/, './'); // assure starting with ./ which is helpful in configuration.yaml
    const regex = new RegExp(config.server.modules + '(/[^/]+)/server/index.js');
    const moduleRoute = loadFilename.replace(regex, '$1');
    routers[moduleRoute] = require(loadFilename);
  });

/**
 * Default base directory for views
 *
 * @name view_default_directory
 */
app.set('views', __dirname);

/**
 * Default render ejs files
 *
 * @name view_engine_default_ejs
 */
app.set('view engine', 'ejs');

/**
 * Use body-parser.json on post requests
 *
 * @name use_bodyParser
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Use cookie-parser on requests
 *
 * @name use_cookieParser
 */
app.use(cookieParser());

/**
 * Use i18n for requests
 *
 * @name use_i18n
 */
i18n.configure({
  defaultLocale: config.server.languages[0],
  locales: config.server.languages,
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

/**
 * Use session handling with 24h memorystore
 *
 * @name use_session
 */
app.use(session({
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: 'uif fsranöaiorawrua vrw',
  resave: false,
  saveUninitialized: true,
  cookie: {
    // secure: true, // HTTPS
    // domain: 'example.com',
    // path: 'foo/bar',
    // maxAge: expiryDate
  }
}));

/**
 * Use express in modules
 *
 * @name module_router_use_express
 */
for (const router of Object.values(routers)) {
  /* c8 ignore next 3 */
  if (router.useExpress) {
    router.useExpress(app);
  }
}

/**
 * Route for root dir
 *
 * @param {object} req - request
 * @param {object} res - response
 */
/* c8 ignore next 3 */
const requestGetBaseRoute = (req, res) => {
  res.sendFile(path.join(config.server.docroot, 'index.html'));
};
app.get('/', requestGetBaseRoute);

/**
 * Route for app main page
 *
 * @param {object} req - request
 * @param {object} res - response
 */
const requestGetAppRoute = (req, res) => {
  // console.log(Object.keys(req.cookies));
  // console.log(JSON.stringify(req.cookies, null, 2));
  res.cookie('cookieName', 'cookieValue', { Path: '/', HttpOnly: true });
  res.render(viewPath('app'), config.getData(req));
};
app.get('/app', requestGetAppRoute);

/**
 * Route for i18n ejs test page
 *
 * @param {object} req - request
 * @param {object} res - response
 */
const requestGetI18nRoute = (req, res) => {
  res.render(viewPath('i18n-test'), config.getData(req));
};
app.get('/i18n-ejs', requestGetI18nRoute);

/**
 * Route for error 500 test page - simply throw error
 */
const requestGet500Route = () => {
  throw new Error('testing server error');
};
app.get('/error500', requestGet500Route);

/**
 * HTTP server listens on process.env.SERVER_PORT
 *
 * @name httpServer:listen
 */
httpServer.listen(process.env.SERVER_PORT);
/**
 * HTTP server fires on error
 *
 * @name httpServer:onError
 * @event server_listen:onError
 */
httpServer.on('error', onError);
/**
 * HTTP server fires on listening
 *
 * @name httpServer:onListening
 * @event server_listen:onListening
 */
httpServer.on('listening', onListening.bind(null, 'http', process.env.SERVER_PORT));

/**
 * HTTPS server listens on process.env.HTTPS_PORT
 *
 * @name httpsServer:listen
 */
httpsServer.listen(process.env.HTTPS_PORT);
/**
 * HTTPS server fires on error
 *
 * @name httpsServer:onError
 * @event server_listen:onErrorHttps
 */
httpsServer.on('error', onError);
/**
 * HTTPS server fires on listening
 *
 * @name httpsServer:onListening
 * @event server_listen:onListeningHttps
 */
httpsServer.on('listening', onListening.bind(null, 'https', process.env.HTTPS_PORT));

/**
 * Connect server and use routes from modules
 *
 * @name module_router_connect_server
 */
for (const [moduleRoute, router] of Object.entries(routers)) {
/* c8 ignore next 3 */
  if (router.connectServer) {
    router.connectServer(httpServer, httpsServer);
  }
  app.use(moduleRoute, router.router);
}

/**
 * Route for failure handling
 *
 * @param {object} req - request
 * @param {object} res - response
 */
const requestGetFailureRoute = (req, res, next) => {
  let data = config.getData(req);
  if (req.error) {
    console.log('req.error:', req.error);
    data.error = req.error;
    if (data.error.code) {
      res.status(data.error.code);
    }
    res.render(viewPath('error'), data);
  } else {
    next();
  }
};
app.get('*', requestGetFailureRoute);

/**
 * Route for 404 / not found errors
 *
 * @param {object} req - request
 * @param {object} res - response
 */
const requestGet404Route = (req, res) => {
  res.status(404).render(viewPath('error'), {
    ...config.getData(req),
    error: {
      code: 404,
      name: 'not found'
    }
  });
};
app.get('*', requestGet404Route);

/**
 * Handle server 500 errors
 *
 * @param {object} err - error
 * @param {object} req - request
 * @param {object} res - response
 * @param {object} next - needed for complete signature
 */
const requestError500Handler = (err, req, res, next) => {
  /* c8 ignore next 3 */
  if (req.path !== '/error500/') {
    console.error('SERVER ERROR:', err.message);
  }
  if (err) {
    res
      .status(500)
      .render(viewPath('error'), {
        error: {
          code: 500,
          name: 'server error',
          error: err
        },
        ...config.getData(req)
      });
  /* c8 ignore next 3 */
  } else {
    next();
  }
};
app.use(requestError500Handler);

/**
 * Get the path for file to render
 *
 * @param {string} page - page type
 * @param {string} type - file type (ejs, jade, pug, html)
 */
/* c8 ignore next 3 */
function viewPath(page = 'error', type = 'ejs') {
  return config.server.modules + '/pages/views/' + page + '.' + type;
}

/**
 * Event listener for server `error` event.
 *
 * @function onError
 * @param {object} error - error object
 * @listens server_listen:onError
 * @listens server_listen:onErrorHttps
 */
/* c8 ignore next 18 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(process.env.SERVER_PORT + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(process.env.SERVER_PORT + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for server `listening` event
 *
 * emits event for gulp server-start task
 *
 * @function onListening
 * @param {string} proto - protocol
 * @param {string} port - error object
 * @listens server_listen:onListening
 * @listens server_listen:onListeningHttps
 */
function onListening(proto, port) {
  log.info('server listening on ' +
    chalk.greenBright(proto + '://' + ipv4addresses.get()[0] + ':' + port));
  /* c8 ignore next 3 */
  if (process.send !== undefined && proto === 'https') {
    process.send('server listening');
  }
}

/**
 * Show message on exit
 */
/* c8 ignore next 3 */
process.on('exit', () => {
  console.log('server exited.');
});
