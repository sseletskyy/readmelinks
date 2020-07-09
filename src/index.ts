const aPath = require('path');
const main = require('./lib');
const parentRoot = aPath.join(__dirname, '..', '..', '..');
console.log(`parent root folder = ${parentRoot}`);

const parentPackageJson = main.readJson(aPath.join(parentRoot, 'package.json'));
console.log('PACKAGE.JSON\n', parentPackageJson['readme-links']);

const config = {
  root: parentRoot,
  readMePath: aPath.join(parentRoot, 'README.md'),
  commentMark: parentPackageJson?.readmelinks?.commentMark,
  srcRoot: parentPackageJson?.readmelinks?.srcRoot,
} as Config;
main.updateRootReadme(config);
