const 
gulp = require('gulp'),
minify = require('gulp-minify'),
uglify = require('gulp-uglify')
;

gulp.task('build', function(){
  return gulp.src([
    'src/spellfucker.js',
  ])
  .pipe(uglify())
  .pipe(gulp.dest('build'));
});

gulp.task('default', [ 'build' ]);