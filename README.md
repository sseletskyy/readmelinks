
# readmelinks

<p>
  <a href='https://app.codeship.com/projects/404985'><img src='https://app.codeship.com/projects/adcb5e50-b9f4-0138-49d4-468ae6770853/status?branch=master' alt='Codeship Status for sseletskyy/readmelinks' /></a>
  <a href='https://coveralls.io/github/sseletskyy/readmelinks?branch=master'><img src='https://coveralls.io/repos/github/sseletskyy/readmelinks/badge.svg?branch=master' alt='Coverage Status' /></a>  
  <a href="https://www.npmjs.com/package/readmelinks">
    <img src="https://img.shields.io/npm/v/readmelinks.svg"
         alt="npm version">
  </a>
  <a href="https://packagephobia.now.sh/result?p=readmelinks">
    <img src="https://packagephobia.now.sh/badge?p=readmelinks"
         alt="install size">
  </a>
  <a href="https://github.com/sseletskyy/readmelinks/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/readmelinks.svg"
         alt="license">
  </a>
  <a href="https://david-dm.org/sseletskyy/readmelinks">
    <img src="https://david-dm.org/sseletskyy/readmelinks/status.svg"
         alt="dependency status">
  </a>
</p>

## TL;DR

#### Install
```
npm i -D readmelinks
```
or
```
yarn add readmelinks -D
```
#### First run
```
yarn readmelinks
```

or

```
node_modules/.bin/readmelinks
```     

Check generated configuration in the `package.json`

## Overview
A simple tool which does two things
* finds all `*.md` files across the project (`<root>/src` is default folder for search)
* inserts links of found files into the `README.md` in the root of the project

## No extra dependencies
`readmelinks` uses only `Nodejs` API.

Although it is written in `typescript` and tested with Jest, in the end you are using a pure `Javascript` tool without any 3-rd party dependencies and thus unexpected surprises.

## Configuration
First run of `node_modules/.bin/readmelinks` inserts default configuration and script into `package.json`.

```
// package.json
{
  ...
  "scripts": {
    ...
    "readmelinks": "readmelinks"
  },
  ...    
  "readmelinks": {
    "srcRoot": "src",
    "commentMark": "readmelinks-generator",
    "regexp": "*.md"
  }
}
```
Then you can run the tool with a short command
```
npm run readmelinks
```

#### `srcRoot`
Relative path to the search folder

##### Example:

Name of the project folder = `foo`

Name of the search folder = `app`

Absolute path to search folder = `~/project/foo/src/app`

Config value to use = `"srcRoot": "src/app"`

#### `commentMark`
Name of the comment placeholder, which `readmelinks` 
uses to find the location for generated content.

##### Example:
 
`"commentMark": "readmelinks-generator"`

First time `readmelinks` is executed it inserts two comment lines in the end of `README.md`
unless those comment lines are already present.
The generated list of links will be put between them. 

```
<!-- readmelinks-generator-begin -->
... generated content is updated here every time readmelinks is executed
<!-- readmelinks-generator-end -->

```  

You can move those two lines wherever you want in `README.md`

#### `regexp`

This attribute is for future updates. It does not impact on the work of the tool.