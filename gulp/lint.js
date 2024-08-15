/**
 * Gulp tasks for linting sources
 *
 * @module gulp/lint
 * @requires module:lib/config
 * @requires module:lib/files-promises
 * @requires module:gulp/lib/load-tasks
 * @requires module:gulp/lib/notify
 */

'use strict';

const gulp = require('gulp'),
  changedInPlace = require('gulp-changed-in-place'),
  eslint = require('gulp-eslint'),
  gulpIf = require('gulp-if'),
  jsonlint = require('gulp-jsonlint'),
  lesshint = require('gulp-lesshint'),
  pugLinter = require('gulp-pug-linter'),
  yamlValidate = require('gulp-yaml-validate'),
  path = require('path'),
  glob = require('glob'),
  check = require('syntax-error'),
  through2 = require('through2'),
  config = require('../lib/config'),
  notify = require('./lib/notify');

let tasks = {
  /**
   * Apply eslint to `config.gulp.lint.eslint.files` files
   *
   * @function eslint
   * @return {Gulp-Pipe} piped steps for eslint, report, fixture, logging and fail on error
   */
  'eslint': () => {
    const isFixed = (file) => {
      /* c8 ignore next 1 */
      return file.eslint != null && file.eslint.fixed;
    };
    return gulp.src(config.gulp.lint.eslint.files)
      .pipe(gulpIf(global.gulpStatus.isWatching, changedInPlace({ howToDetermineDifference: 'modification-time' })))
      .pipe(notify({ message: 'linting: <%= file.path %>', title: 'Gulp eslint' }))
      .pipe(eslint({ configFile: path.join(__dirname, '..', '.eslintrc.js'), fix: true }))
      .pipe(eslint.format())
      .pipe(eslint.results(results => {
        /* c8 ignore next 7 */
        if (results.length && (results.warningCount > 0 || results.errorCount > 0)) {
          console.log(
            `Total Results: ${results.length},  ` +
              `Warnings: ${results.warningCount}, ` +
              `Errors: ${results.errorCount}`
          );
        }
      }))
      /* c8 ignore next 1 */
      .pipe(gulpIf(isFixed, gulp.dest(config.gulp.lint.eslint.fixtureDir || './fixture')))
      .pipe(gulpIf(isFixed, notify({
        message: 'fixture: <%= file.path %>',
        title: 'Gulp eslint --fix'
      })))
      .pipe(eslint.failAfterError());
  },
  /**
   * Apply jsonlint to `config.gulp.watch.jsonlint` files
   *
   * @function jsonlint
   * @return {Gulp-Pipe} piped steps for jsonlint
   */
  'jsonlint': () => {
    return gulp.src(config.gulp.watch.jsonlint)
      .pipe(jsonlint())
      .pipe(jsonlint.reporter());
  },
  /**
   * Apply jsonlint to `config.gulp.watch.locales` files
   *
   * @function localesjsonlint
   * @return {Gulp-Pipe} piped steps for locales json files, report and fail on error
   */
  'localesjsonlint': () => {
    return gulp.src(config.gulp.watch.locales)
      .pipe(jsonlint())
      .pipe(jsonlint.failOnError());
  },
  /**
   * Apply lesshint to `config.gulp.watch.less` files
   *
   * @function lesshint
   * @return {Gulp-Pipe} piped steps for lesslint, report and fail on error
   */
  'lesshint': () => {
    return gulp.src(config.gulp.watch.less)
      .pipe(lesshint())
      .on('error', function () {})
      .pipe(lesshint.reporter())
      .pipe(lesshint.failOnError());
  },
  /**
   * Apply yamlValidate to `config.gulp.watch.yamllint` files
   *
   * @function yamllint
   * @return {Gulp-Pipe} piped steps for yamllint, log on error
   */
  'yamllint': () => {
    return gulp.src(config.gulp.watch.yamllint)
      .pipe(yamlValidate({ space: 2 }))
      .on('error', (msg) => {
        /* c8 ignore next 1 */
        console.log(msg);
      });
  },
  /**
   * Apply pug-linter to `config.gulp.watch.puglint` files
   *
   * @function puglint
   * @return {Gulp-Pipe} piped steps for puglint, report and fail on error
   */
  'puglint': () => {
    return gulp.src(config.gulp.watch.puglint)
      .pipe(pugLinter({ reporter: 'default', failAfterError: true }));
  },
  /**
   * Lint `config.gulp.watch.ejslint` files
   *
   * - replace `<%=`, `<%-` tags with output = [expression];
   * - strip non ejs html and `<%` and `%>`
   * - keep lines for counting
   *
   * @function ejslint-exec
   * @param {function} callback - gulp callback to signal end of task
   */
  'ejslint': async () => {

    function lintEjs(file, enc, callback) {
      let fileContent = '<% var output, output_raw; %>' + file.contents.toString()
        .replace(/<%[=-]/g, '<% ')
        .replace(/[=-]%>/g, ' %>');
      const lines = fileContent.split('\n');
      let output = [];
      let codeMode = false;
      lines.forEach((line) => {
        let parts = [];
        line.split(/(<%[=\- ]|[ \-=]%>)/).forEach((token) => {
          switch (token) {
            case '<%=':
              parts.push('ä= ');
              codeMode = true;
              break;
            case '<%-':
              parts.push('ö= ');
              codeMode = true;
              break;
            case '<% ':
              parts.push(';  ');
              codeMode = true;
              break;
            case ' %>':
            case '-%>':
            case '=%>':
              parts.push(' ;');
              codeMode = false;
              break;
            default:
              if (codeMode) {
                parts.push(token);
              } else {
                parts.push(' '.repeat(token.length));
              }
          }
        });
        output.push(parts.join(''));
      });
      const err = check(output.join('\n'), path.relative(process.cwd(), file.path));
      if (err) {
        let errMsg = err.message + ' in line ' + err.line + '\n';
        errMsg += lines[err.line - 1] + '\n';
        errMsg += ' '.repeat(err.column - 5) + '----^\n';
        file.error = errMsg;
      } else {
        file.contents = Buffer.from(output.join(''));
      }
      callback(null, file);
    }

    return gulp.src(config.gulp.watch.ejslint)
      .pipe(gulpIf(global.gulpStatus.isWatching, changedInPlace({ firstPass: true })))
      .pipe(through2.obj(lintEjs))
      .pipe(notify({ message: 'linting: <%= file.path %>', title: 'Gulp ejslint' }))
      .pipe(gulpIf(
        (file) => file.error !== undefined,
        notify({ message: 'error: <%= file.error %>', title: 'Gulp ejslint' })
      ));
  }
};

let moduleTasks = [];
/**
 * Load gulp lint from modules
 *
 * @name module_gulp_loader
 */
glob.sync(config.server.modules + '/*/gulp/lint.js')
  .forEach((filename) => {
    let task = require('.' + filename);
    moduleTasks.push(task);
    tasks = Object.assign({}, tasks, task);
  });

module.exports = Object.assign({}, tasks, ...moduleTasks);
