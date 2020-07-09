const path = require('path');
const fs = require('fs');

interface Config {
  root: string;
  srcRoot: string;
  readMePath: string;
  commentMark: string;
}

const defaultConfig: Partial<Config> = {
  // commentMark: 'readme-md-content-generator',
};

/**
 * Searches recursively for all README.md files
 * returns an array of absolute paths of found files
 * @param {string} dir - search inside of this dir
 * @param {string[]} files - should not be provided, is used for recursive calls, an array which accumulates all found files
 * @returns {string[]}
 */
function getFiles(dir: string, files: string[] = []): string[] {
  const nestedFiles = fs.readdirSync(dir);
  for (let i in nestedFiles) {
    let name = nestedFiles[i];
    let fullName = path.join(dir, name);
    if (fs.statSync(fullName).isDirectory()) {
      getFiles(fullName, files);
    } else {
      if (/\w+\.md$/.test(name)) {
        files.push(fullName);
      }
    }
  }
  return files;
}

/**
 * It finds special begin and end marks in the root README.md file
 * and replaces the content between those marks with provided links
 *
 * @param {string} fileContent - the content of the root README.md file
 * @param {string[]} links - array of prepared links to found nested README.md files
 * @returns {string} - updated file content
 */
function replaceContent(
  commentMark: string,
  fileContent: string,
  links: string[],
): string | null {
  const lines = fileContent.split('\n');
  const README_COMMENT_MARK_BEGIN = `${commentMark}-begin`;
  const README_COMMENT_MARK_END = `${commentMark}-end`;

  // console.log('lines\n', lines);
  let beginLine = lines.findIndex((line) =>
    line.includes(README_COMMENT_MARK_BEGIN),
  );
  let endLine = lines.findIndex((line) =>
    line.includes(README_COMMENT_MARK_END),
  );
  if (beginLine < 0 && endLine < 0) {
    lines.push(`<!-- ${README_COMMENT_MARK_BEGIN} -->`);
    lines.push(`<!-- ${README_COMMENT_MARK_END} -->`);
    beginLine = lines.length - 2;
    endLine = beginLine + 1;
  } else if (beginLine < 0 && endLine >= 0) {
    beginLine = endLine;
    lines.splice(beginLine, 0, `<!-- ${README_COMMENT_MARK_BEGIN} -->`);
    endLine++;
  } else if (endLine < 0 && beginLine >= 0) {
    endLine = beginLine + 1;
    lines.splice(endLine, 0, `<!-- ${README_COMMENT_MARK_END} -->`);
  }
  if (endLine < beginLine) {
    return null;
  }
  return [
    ...lines.slice(0, beginLine + 1),
    ...links,
    ...lines.slice(endLine),
  ].join('\n');
}

/**
 * Utility method to read the content of the file
 * @param {string} readMePath string
 * @returns {string} - content of the file
 */
function readRootReadme(readMePath: string): string {
  return fs.readFileSync(readMePath, { encoding: 'utf8', flag: 'r' });
}

/**
 * Utility method to update the file
 * @param {string} readMePath
 * @param {string} data
 */
function writeRootReadme(readMePath: string, data: string): void {
  fs.writeFileSync(readMePath, data);
}

/**
 * Converts list of absolute paths to markdown links
 * @param {string} root - path to the root of the project
 * @param {string} srcRoot - path to the root of the search for nested README.md files
 * @param {string[]} files - list of absolute paths
 * @returns {string[]} links - list of links in the format '[title](relative url)'
 */
function generateLinks(
  root: string,
  srcRoot: string,
  files: string[],
): string[] {
  return files.map((file) => {
    const dirs: string[] = file.substring(srcRoot.length + 1).split('/');
    const dir: string = dirs.slice(0, -1).join('/');
    const url = file.substring(root.length + 1);
    return `[${dir}](${url})`;
  });
}

type Formatter = (x: string) => string;

/**
 * Applies a decorator function to every link
 * @param {string[]} links - list of markdown links
 * @param {Function} formatter
 * @returns {string[]} links - list of markdown links
 */
function applyFormat(links: string[], formatter: Formatter): string[] {
  return links.map(formatter);
}

/**
 * main function which updates root README.md file
 */
function updateRootReadme(config: Config) {
  ['root', 'srcRoot', 'readMePath', 'commentMark'].forEach((key) => {
    if (key !== undefined && !config[key as keyof Config]) {
      throw new Error(`In package.json readmelinks.${key} is missing`);
    }
  });

  console.log('Root\n', config.root);
  config.srcRoot = path.join(config.root, config.srcRoot);
  console.log('srcRoot\n', config.srcRoot);
  console.log('readMePath\n', config.readMePath);
  console.log('commentMark\n', config.commentMark);

  const files = getFiles(config.srcRoot);
  console.log('found files\n', JSON.stringify(files, null, 2));

  const formatter: Formatter = (x) => `* ${x}`;
  const links = generateLinks(config.root, config.srcRoot, files);
  const formattedLinks = applyFormat(links, formatter);

  const fileContent = readRootReadme(config.readMePath);
  const updatedFileContent = replaceContent(
    config.commentMark,
    fileContent,
    formattedLinks,
  );
  updatedFileContent && writeRootReadme(config.readMePath, updatedFileContent);
}

function readJson(filename: string) {
  return JSON.parse(fs.readFileSync(filename, 'utf-8'));
}

function writeJson(filename: string, content: Record<string, string>) {
  fs.writeFileSync(filename, JSON.stringify(content, null, 2) + '\n');
}

async function updateParentPackage(parentPackagePath: string) {
  const pkg = await readJson(parentPackagePath);
  pkg.scripts = {
    ...(pkg.scripts || {}),
    'readme:links': 'readmelinks',
  };
  await writeJson(parentPackagePath, pkg);
}

module.exports = {
  applyFormat,
  generateLinks,
  replaceContent,
  updateRootReadme,
  readJson,
  getFiles,
  readRootReadme,
  writeRootReadme,
};
