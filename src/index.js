"use strict";
var aPath = require('path');
var main = require('./lib');
var parentRoot = aPath.join(__dirname, '..', '..', '..');
console.log("parent root folder = " + parentRoot);
var parentPackageJsonPath = aPath.join(parentRoot, 'package.json');
var parentPackageJson = main.readJson(parentPackageJsonPath);
console.log('PACKAGE.JSON\n', parentPackageJson['readmelinks']);
var jsonWithDefaultConfigOrNothing = main.generateDefaultConfigInPackageJson(parentPackageJson);
var configFromJson;
if (!!jsonWithDefaultConfigOrNothing) {
    main.writeJson(parentPackageJsonPath, jsonWithDefaultConfigOrNothing);
    configFromJson = jsonWithDefaultConfigOrNothing.readmelinks;
}
else {
    configFromJson = parentPackageJson.readmelinks;
}
var config = {
    root: parentRoot,
    readMePath: aPath.join(parentRoot, 'README.md'),
    commentMark: configFromJson.commentMark,
    srcRoot: configFromJson.srcRoot,
};
main.updateRootReadme(config);
