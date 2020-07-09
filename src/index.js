"use strict";
var _a, _b;
var aPath = require('path');
var main = require('./lib');
var parentRoot = aPath.join(__dirname, '..', '..', '..');
console.log("parent root folder = " + parentRoot);
var parentPackageJson = main.readJson(aPath.join(parentRoot, 'package.json'));
console.log('PACKAGE.JSON\n', parentPackageJson['readme-links']);
var config = {
    root: parentRoot,
    readMePath: aPath.join(parentRoot, 'README.md'),
    commentMark: (_a = parentPackageJson === null || parentPackageJson === void 0 ? void 0 : parentPackageJson.readmelinks) === null || _a === void 0 ? void 0 : _a.commentMark,
    srcRoot: (_b = parentPackageJson === null || parentPackageJson === void 0 ? void 0 : parentPackageJson.readmelinks) === null || _b === void 0 ? void 0 : _b.srcRoot,
};
main.updateRootReadme(config);
