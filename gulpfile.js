let path = require('path')

const
	gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	babel = require('gulp-babel'),
	eslint = require('gulp-eslint'),
	excludeGitignore = require('gulp-exclude-gitignore'),
	del = require('del'),
  nodemon = require('gulp-nodemon');



gulp.task('clean', function () {
  return del('build');
});

gulp.task('lint', function () {
  return gulp.src('./src/**/*.js')
  .pipe(excludeGitignore())
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('vue', function() {
  del('./build/**/*.vue')
  return gulp.src('./src/**/*.vue')
  .pipe(gulp.dest('build'));
})

gulp.task('babel', function() {
	return gulp.src('./src/**/*.js')
	.pipe(sourcemaps.init())
	.pipe(babel( {
		presets: ['env']
	}))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('build'));
});

gulp.task('default', ['watch'])

gulp.task('watch', ['babel', 'vue'], function () {
  let lastCompile = {tasks: [], date: Date.now()}
  let coolDown = 6 * 1000

  var stream = nodemon({
                 script: 'build/main.js' // run transpiled code
               , ext: 'js vue'
               , watch: 'src/*'
               , tasks: changes => {
                  var tasks = []
                  changes.forEach(file => {
                    console.log(path.extname(file))
                    if (path.extname(file) === '.js' && !~tasks.indexOf('babel')) tasks.push('babel')
                    if (path.extname(file) === '.vue' && !~tasks.indexOf('vue')) tasks.push('vue')
                  })
                  console.log('tasks: ' + tasks.join(', '))
                  if (Date.now() - lastCompile.date < coolDown && lastCompile.tasks === tasks)
                    return []
                  lastCompile.date = Date.now()
                  return tasks
               } // compile synchronously onChange
               , env: { 'NODE_ENV': 'development', 'VUE_DEV': true }
               , execMap: {
                js: 'node --inspect'
               }
              })

  return stream
})