var aPath = require('path');
var main = require('./lib');
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
var config = {
    root: parentRoot,
    readMePath: aPath.join(parentRoot, 'README.md'),
    commentMark: configFromJson.commentMark,
    srcRoot: configFromJson.srcRoot,
};
main.updateRootReadme(config);
