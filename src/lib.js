var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var path = require('path');
var fs = require('fs');
var defaultConfig = {
// commentMark: 'readme-md-content-generator',
};
/**
 * Searches recursively for all README.md files
 * returns an array of absolute paths of found files
 * @param {string} dir - search inside of this dir
 * @param {string} regexp - a RegExp string to match the file search
 * @param {string[]} files - should not be provided, is used for recursive calls, an array which accumulates all found files
 * @returns {string[]}
 */
function getFiles(dir, regexp, files) {
    if (files === void 0) { files = []; }
    var nestedFiles = fs.readdirSync(dir);
    for (var i in nestedFiles) {
        var name_1 = nestedFiles[i];
        var fullName = path.join(dir, name_1);
        if (fs.statSync(fullName).isDirectory()) {
            getFiles(fullName, regexp, files);
        }
        else {
            if (regexp.test(name_1)) {
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
function replaceContent(commentMark, fileContent, links) {
    var lines = fileContent.split('\n');
    var README_COMMENT_MARK_BEGIN = commentMark + "-begin";
    var README_COMMENT_MARK_END = commentMark + "-end";
    // console.log('lines\n', lines);
    var beginLine = lines.findIndex(function (line) {
        return line.includes(README_COMMENT_MARK_BEGIN);
    });
    var endLine = lines.findIndex(function (line) {
        return line.includes(README_COMMENT_MARK_END);
    });
    if (beginLine < 0 && endLine < 0) {
        lines.push("<!-- " + README_COMMENT_MARK_BEGIN + " -->");
        lines.push("<!-- " + README_COMMENT_MARK_END + " -->");
        beginLine = lines.length - 2;
        endLine = beginLine + 1;
    }
    else if (beginLine < 0 && endLine >= 0) {
        beginLine = endLine;
        lines.splice(beginLine, 0, "<!-- " + README_COMMENT_MARK_BEGIN + " -->");
        endLine++;
    }
    else if (endLine < 0 && beginLine >= 0) {
        endLine = beginLine + 1;
        lines.splice(endLine, 0, "<!-- " + README_COMMENT_MARK_END + " -->");
    }
    if (endLine < beginLine) {
        return null;
    }
    return __spreadArrays(lines.slice(0, beginLine + 1), links, lines.slice(endLine)).join('\n');
}
/**
 * Utility method to read the content of the file
 * @param {string} readMePath string
 * @returns {string} - content of the file
 */
function readRootReadme(readMePath) {
    return fs.readFileSync(readMePath, { encoding: 'utf8', flag: 'r' });
}
/**
 * Utility method to update the file
 * @param {string} readMePath
 * @param {string} data
 */
function writeRootReadme(readMePath, data) {
    fs.writeFileSync(readMePath, data);
}
/**
 * Converts list of absolute paths to markdown links
 * @param {string} root - path to the root of the project
 * @param {string} srcRoot - path to the root of the search for nested README.md files
 * @param {string[]} files - list of absolute paths
 * @returns {string[]} links - list of links in the format '[title](relative url)'
 */
function generateLinks(root, srcRoot, files, showFileName) {
    return files.map(function (file) {
        var url = file.substring(root.length + 1);
        var dir = file.substring(srcRoot.length + 1);
        var caption = showFileName ? dir : dir.split('/').slice(0, -1).join('/');
        return "[" + caption + "](" + url + ")";
    });
}
/**
 * Applies a decorator function to every link
 * @param {string[]} links - list of markdown links
 * @param {Function} formatter
 * @returns {string[]} links - list of markdown links
 */
function applyFormat(links, formatter) {
    return links.map(formatter);
}
/**
 * main function which updates root README.md file
 */
function updateRootReadme(config) {
    ['root', 'srcRoot', 'readMePath', 'commentMark', 'regexp'].forEach(function (key) {
        if (key !== undefined && !config[key]) {
            throw new Error("In package.json readmelinks." + key + " is missing");
        }
    });
    config.srcRoot = path.join(config.root, config.srcRoot);
    // console.log('Config in package.json:');
    // console.log(JSON.stringify(config, null, 2));
    var files = getFiles(config.srcRoot, new RegExp(config.regexp));
    console.log('Found files');
    console.log(JSON.stringify(files, null, 2));
    var formatter = function (x) { return "* " + x; };
    var links = generateLinks(config.root, config.srcRoot, files, config.showFileName);
    var formattedLinks = applyFormat(links, formatter);
    var fileContent = readRootReadme(config.readMePath);
    var updatedFileContent = replaceContent(config.commentMark, fileContent, formattedLinks);
    updatedFileContent && writeRootReadme(config.readMePath, updatedFileContent);
}
function readJson(filename) {
    return JSON.parse(fs.readFileSync(filename, 'utf-8'));
}
function writeJson(filename, content) {
    fs.writeFileSync(filename, JSON.stringify(content, null, 2) + '\n');
}
function addScriptToParentPackage(parentPackageJson) {
    return __assign(__assign({}, (parentPackageJson.scripts || {})), { readmelinks: 'readmelinks' });
}
var DEFAULT_SETTINGS = {
    srcRoot: 'src',
    commentMark: 'readmelinks-generator',
    regexp: '*.md',
};
function generateDefaultConfigInPackageJson(parentPackageJson) {
    if (!parentPackageJson.readmelinks) {
        parentPackageJson.readmelinks = DEFAULT_SETTINGS;
        parentPackageJson.scripts = addScriptToParentPackage(parentPackageJson);
        return parentPackageJson;
    }
    else {
        return null;
    }
}
module.exports = {
    applyFormat: applyFormat,
    generateLinks: generateLinks,
    replaceContent: replaceContent,
    updateRootReadme: updateRootReadme,
    readJson: readJson,
    writeJson: writeJson,
    getFiles: getFiles,
    readRootReadme: readRootReadme,
    writeRootReadme: writeRootReadme,
    generateDefaultConfigInPackageJson: generateDefaultConfigInPackageJson,
    DEFAULT_SETTINGS: DEFAULT_SETTINGS,
};
