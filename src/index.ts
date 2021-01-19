const aPath = require('path');
const fs = require('fs');
const main = require('./lib');
// const dirName =
//   `/Users/cw2930/projects/cw-buyer/node_modules/readmelinks/src` || __dirname;
// console.log(`readmelinks :: __dirname = ${dirName}`);
// const parentRoot = aPath.join(__dirname, '..', '..', '..');
const parentRoot = findParentPkgDesc();

const parentPackageJsonPath = aPath.join(parentRoot, 'package.json');
const parentPackageJson = main.readJson(parentPackageJsonPath);
console.log('Config in package.json:');
console.log(parentPackageJson['readmelinks']);

const jsonWithDefaultConfigOrNothing = main.generateDefaultConfigInPackageJson(
  parentPackageJson,
);
type PackageJsonConfig = Record<string, any>;
let configFromJson: PackageJsonConfig | PackageJsonConfig[];
if (!!jsonWithDefaultConfigOrNothing) {
  main.writeJson(parentPackageJsonPath, jsonWithDefaultConfigOrNothing);
  configFromJson = jsonWithDefaultConfigOrNothing.readmelinks;
} else {
  configFromJson = parentPackageJson.readmelinks;
}

const updateRootReadme = (packageJsonConfig: PackageJsonConfig) => {
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
  configFromJson.forEach((config) => updateRootReadme(config));
} else {
  updateRootReadme(configFromJson);
}

function findParentPkgDesc(directory?: string): string | null {
  if (!directory) {
    directory = aPath.dirname(require!.main!.filename);
  }
  const file = aPath.resolve(directory, 'package.json');
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    return file;
  }
  const parent = aPath.resolve(directory, '..');
  if (parent === directory) {
    return null;
  }
  return findParentPkgDesc(parent);
}
