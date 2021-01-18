"use strict";
var aPath = require('path');
var main = require('./lib');
// const dirName =
//   `/Users/cw2930/projects/cw-buyer/node_modules/readmelinks/src` || __dirname;
// console.log(`readmelinks :: __dirname = ${dirName}`);
var parentRoot = aPath.join(__dirname, '..', '..', '..');
var parentPackageJsonPath = aPath.join(parentRoot, 'package.json');
var parentPackageJson = main.readJson(parentPackageJsonPath);
console.log('Config in package.json:');
console.log(parentPackageJson['readmelinks']);
var jsonWithDefaultConfigOrNothing = main.generateDefaultConfigInPackageJson(parentPackageJson);
var configFromJson;
if (!!jsonWithDefaultConfigOrNothing) {
    main.writeJson(parentPackageJsonPath, jsonWithDefaultConfigOrNothing);
    configFromJson = jsonWithDefaultConfigOrNothing.readmelinks;
}
else {
    configFromJson = parentPackageJson.readmelinks;
}
var updateRootReadme = function (packageJsonConfig) {
    main.updateRootReadme({
        root: parentRoot,
        readMePath: aPath.join(parentRoot, 'README.md'),
        commentMark: packageJsonConfig.commentMark,
        srcRoot: packageJsonConfig.srcRoot,
        regexp: packageJsonConfig.regexp,
        showFileName: !!packageJsonConfig.showFileName,
    });
};
if (Array.isArray(configFromJson)) {
    configFromJson.forEach(function (config) { return updateRootReadme(config); });
}
else {
    updateRootReadme(configFromJson);
}
