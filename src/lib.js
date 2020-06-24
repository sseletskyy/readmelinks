"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var root = path.join(__dirname, '..');
var srcRoot = path.join(root, 'app');
var readMePath = path.join(root, 'README.md');
var README_COMMENT_MARK = 'readme-md-content-generator';
var README_COMMENT_MARK_BEGIN = README_COMMENT_MARK + "-begin";
var README_COMMENT_MARK_END = README_COMMENT_MARK + "-end";
/**
 * Searches recursively for all README.md files
 * returns an array of absolute paths of found files
 * @param {string} dir - search inside of this dir
 * @param {string[]} files - should not be provided, is used for recursive calls, an array which accumulates all found files
 * @returns {string[]}
 */
function getFiles(dir, files) {
    if (files === void 0) { files = []; }
    var nestedFiles = fs.readdirSync(dir);
    for (var i in nestedFiles) {
        var name_1 = nestedFiles[i];
        var fullName = path.join(dir, name_1);
        if (fs.statSync(fullName).isDirectory()) {
            getFiles(fullName, files);
        }
        else {
            if (/README\.md/.test(name_1)) {
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
function replaceContent(fileContent, links) {
    var lines = fileContent.split('\n');
    var beginLine = lines.findIndex(function (line) {
        return line.includes(README_COMMENT_MARK_BEGIN);
    });
    if (beginLine < 0) {
        return null;
    }
    var endLine = lines.findIndex(function (line) {
        return line.includes(README_COMMENT_MARK_END);
    });
    if (endLine < 0) {
        return null;
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
function generateLinks(root, srcRoot, files) {
    return files.map(function (file) {
        var dirs = file.substring(srcRoot.length + 1).split('/');
        var dir = dirs.slice(0, -1).join('/');
        var url = file.substring(root.length + 1);
        return "[" + dir + "](" + url + ")";
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
function updateRootReadme() {
    console.log('Root\n', root);
    console.log('srcRoot\n', srcRoot);
    console.log('readMePath\n', readMePath);
    var files = getFiles(srcRoot);
    console.log('found files\n', JSON.stringify(files, null, 2));
    var formatter = function (x) { return "* " + x; };
    var links = generateLinks(root, srcRoot, files);
    var formattedLinks = applyFormat(links, formatter);
    var fileContent = readRootReadme(readMePath);
    var updatedFileContent = replaceContent(fileContent, formattedLinks);
    updatedFileContent && writeRootReadme(readMePath, updatedFileContent);
}
function readJson(filename) {
    return JSON.parse(fs.readFileSync(filename, 'utf-8'));
}
function writeJson(filename, content) {
    fs.writeFileSync(filename, JSON.stringify(content, null, 2) + '\n');
}
function updateParentPackage(parentPackagePath) {
    return __awaiter(this, void 0, void 0, function () {
        var pkg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readJson(parentPackagePath)];
                case 1:
                    pkg = _a.sent();
                    pkg.scripts = __assign(__assign({}, (pkg.scripts || {})), { 'readme:links': 'readmelinks' });
                    return [4 /*yield*/, writeJson(parentPackagePath, pkg)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    applyFormat: applyFormat,
    generateLinks: generateLinks,
    replaceContent: replaceContent,
    updateRootReadme: updateRootReadme,
};
