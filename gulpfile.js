const
	gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	babel = require('gulp-babel'),
	eslint = require('gulp-eslint'),
	excludeGitignore = require('gulp-exclude-gitignore'),
	del = require('del');



gulp.task('clean', function () {
  return del('build');
});

gulp.task('eslint', function () {
  return gulp.src('./src/**/*.js')
  .pipe(excludeGitignore())
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('vue', ['clean'], function() {
  return gulp.src('./src/**/*.vue')
  .pipe(gulp.dest('build'));
})

gulp.task('babel', ['vue'], function() {
	return gulp.src('./src/**/*.js')
	.pipe(sourcemaps.init())
	.pipe(babel( {
		presets: ['env']
	}))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('build'));
});

gulp.task('build', ['babel', 'watch']);
gulp.task('default', ['build'])

gulp.task('watch', () => {
    gulp.watch('./src/**/*', ['babel']);
});