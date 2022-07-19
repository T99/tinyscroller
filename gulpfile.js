/*
 * Created by Trevor Sears <trevor@trevorsears.com> (https://trevorsears.com/).
 * 10:39 AM -- July 19, 2022.
 * Project: tinyscroller
 * 
 * tinyscroller - An absolutely abnormally abysmally small image scroller.
 * Copyright (C) 2022 Trevor Sears
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const gulp = require("gulp");
const uglify = require("gulp-uglify-es")["default"];
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const rename = require("gulp-rename");

const paths = {
	
	source: {
		
		dir: "src/",
		allFiles: "src/**/*",
		entryPoint: "src/tinyscroller.js",
		entryPointFileName: "tinyscroller.js",
		
	},
	
	build: {
		
		dir: "build/",
		allFiles: "build/**/*",
		entryPoint: "build/tinyscroller.min.js",
		entryPointFileName: "tinyscroller.min.js",
		
	},
	
};

function clean() {
	
	return del([
		paths.build.dir,
	]);
	
}

function uglifyJavaScript() {
	
	return gulp.src(`${paths.source.allFiles}.js`)
		.pipe(uglify({
			toplevel: true,
		}))
		.pipe(rename((path) => ({
			dirname: path.dirname,
			basename: paths.build.entryPointFileName,
			extname: "",
		})))
		.pipe(gulp.dest(paths.build.dir))
		.pipe(gulp.dest(`docs`));
	
}

function buildJavaScriptPipeline(done) {
	
	return gulp.series(
		uglifyJavaScript
	)(done);
	
}

function minifyStylesheets() {
	
	return gulp.src(`${paths.source.allFiles}.css`)
		.pipe(cleanCSS())
		.pipe(rename((path) => ({
			dirname: path.dirname,
			basename: `tinyscroller.min.css`,
			extname: "",
		})))
		.pipe(gulp.dest(paths.build.dir))
		.pipe(gulp.dest(`docs`));
	
}

function buildStylesheetsPipeline(done) {
	
	return gulp.series(
		minifyStylesheets
	)(done);
	
}

function build(done) {
	
	return gulp.parallel(
		buildJavaScriptPipeline,
		buildStylesheetsPipeline
	)(done);
	
}

function rebuild(done) {
	
	gulp.series(clean, build)(done);
	
}

function defaultTask(done) {
	
	return rebuild(done);
	
}

function watch() {
	
	gulp.watch([`${paths.source.allFiles}.js`], buildJavaScriptPipeline);
	gulp.watch([`${paths.source.allFiles}.css`], buildStylesheetsPipeline);
	
}

// The default Gulp task.
gulp.task("default", defaultTask);

// Cleans (deletes) all generated/compiled files.
gulp.task("clean", clean);

// Builds the entire project.
gulp.task("build", build);

// Cleans and builds the entire project.
gulp.task("rebuild", rebuild);

// Watch for changes to relevant files and compile-on-change.
gulp.task("watch", watch);
