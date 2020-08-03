
# readmelinks

## TL;DR

#### Install
```
npm i -D readmelinks
```
or
```
yarn add readmelinks -D
```
#### Run
```
npx readmelinks
```

## Overview
A simple tool which does two things
* finds all `*.md` files across the project (`<root>/src` is default folder for search)
* inserts links of found files into the `README.md` in the root of the project

## Configuration
First run of `npx readmelinks` inserts default configuration into `package.json`.

```
{
  "srcRoot": "src",
  "commentMark": "readmelinks-generator",
  "regexp": "*.md"
}
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