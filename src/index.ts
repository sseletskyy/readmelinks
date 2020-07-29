const aPath = require('path');
const main = require('./lib');
const parentRoot = aPath.join(__dirname, '..', '..', '..');
console.log(`parent root folder = ${parentRoot}`);

const parentPackageJsonPath = aPath.join(parentRoot, 'package.json');
const parentPackageJson = main.readJson(parentPackageJsonPath);
console.log('PACKAGE.JSON\n', parentPackageJson['readmelinks']);

const jsonWithDefaultConfigOrNothing = main.generateDefaultConfigInPackageJson(
  parentPackageJson,
);
let configFromJson: Record<string, any>;
if (!!jsonWithDefaultConfigOrNothing) {
  main.writeJson(parentPackageJsonPath, jsonWithDefaultConfigOrNothing);
  configFromJson = jsonWithDefaultConfigOrNothing.readmelinks;
} else {
  configFromJson = parentPackageJson.readmelinks;
}

const config = {
  root: parentRoot,
  readMePath: aPath.join(parentRoot, 'README.md'),
  commentMark: configFromJson.commentMark,
  srcRoot: configFromJson.srcRoot,
} as Config;
main.updateRootReadme(config);
