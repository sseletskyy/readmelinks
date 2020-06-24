declare const path: any;
declare const fs: any;
declare const root: any;
declare const srcRoot: any;
declare const readMePath: any;
declare const README_COMMENT_MARK = "readme-md-content-generator";
declare const README_COMMENT_MARK_BEGIN: string;
declare const README_COMMENT_MARK_END: string;
/**
 * Searches recursively for all README.md files
 * returns an array of absolute paths of found files
 * @param {string} dir - search inside of this dir
 * @param {string[]} files - should not be provided, is used for recursive calls, an array which accumulates all found files
 * @returns {string[]}
 */
declare function getFiles(dir: string, files?: string[]): string[];
/**
 * It finds special begin and end marks in the root README.md file
 * and replaces the content between those marks with provided links
 *
 * @param {string} fileContent - the content of the root README.md file
 * @param {string[]} links - array of prepared links to found nested README.md files
 * @returns {string} - updated file content
 */
declare function replaceContent(fileContent: string, links: string[]): string | null;
/**
 * Utility method to read the content of the file
 * @param {string} readMePath string
 * @returns {string} - content of the file
 */
declare function readRootReadme(readMePath: string): string;
/**
 * Utility method to update the file
 * @param {string} readMePath
 * @param {string} data
 */
declare function writeRootReadme(readMePath: string, data: string): void;
/**
 * Converts list of absolute paths to markdown links
 * @param {string} root - path to the root of the project
 * @param {string} srcRoot - path to the root of the search for nested README.md files
 * @param {string[]} files - list of absolute paths
 * @returns {string[]} links - list of links in the format '[title](relative url)'
 */
declare function generateLinks(root: string, srcRoot: string, files: string[]): string[];
declare type Formatter = (x: string) => string;
/**
 * Applies a decorator function to every link
 * @param {string[]} links - list of markdown links
 * @param {Function} formatter
 * @returns {string[]} links - list of markdown links
 */
declare function applyFormat(links: string[], formatter: Formatter): string[];
/**
 * main function which updates root README.md file
 */
declare function updateRootReadme(): void;
declare function readJson(filename: string): any;
declare function writeJson(filename: string, content: Record<string, string>): void;
declare function updateParentPackage(parentPackagePath: string): Promise<void>;
