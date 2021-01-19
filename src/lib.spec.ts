import 'jest';
import * as path from 'path';
import { Config } from './lib';

const fs = require('fs');
const {
  applyFormat,
  generateLinks,
  replaceContent,
  getFiles,
  readRootReadme,
  writeRootReadme,
  readJson,
  generateDefaultConfigInPackageJson,
  updateRootReadme,
  writeJson,
  DEFAULT_SETTINGS,
} = require('./lib.ts');
const commentMark = 'readme-md-content-generator';

describe('ReadmeLinkGenerator', () => {
  describe('generateLinks', () => {
    const files: string[] = [
      '/Users/cw2930/projects/cw-buyer/app/assets/client/components/Pagination/README.md',
      '/Users/cw2930/projects/cw-buyer/app/assets/layout/components/Footer/README.md',
    ];
    const root = '/Users/cw2930/projects/cw-buyer';
    const srcRoot = '/Users/cw2930/projects/cw-buyer/app';
    let subject: string[];
    describe('when showFileName is false', () => {
      beforeAll(() => {
        subject = generateLinks(root, srcRoot, files, false);
      });
      it('should return relative folder path as the caption of the link', () => {
        expect(subject[0]).toContain('[assets/client/components/Pagination]');
        expect(subject[1]).toContain('[assets/layout/components/Footer]');
      });
      it('should return relative path as the link to the file', () => {
        expect(subject[0]).toContain(
          '(app/assets/client/components/Pagination/README.md)',
        );
        expect(subject[1]).toContain(
          '(app/assets/layout/components/Footer/README.md)',
        );
      });
    });
    describe('when showFileName is true', () => {
      beforeAll(() => {
        subject = generateLinks(root, srcRoot, files, true);
      });
      it('should return relative folder path + fileName as the caption of the link', () => {
        expect(subject[0]).toContain(
          '[assets/client/components/Pagination/README.md]',
        );
        expect(subject[1]).toContain(
          '[assets/layout/components/Footer/README.md]',
        );
      });
      it('should return relative path as the link to the file', () => {
        expect(subject[0]).toContain(
          '(app/assets/client/components/Pagination/README.md)',
        );
        expect(subject[1]).toContain(
          '(app/assets/layout/components/Footer/README.md)',
        );
      });
    });
  });
  describe('applyFormat', () => {
    it('should decorate each link according to formatter function', () => {
      const formatter = (x: string) => `* ${x}`;
      const links = ['[ABC](xyz)'];
      const actual = applyFormat(links, formatter);
      const expected = ['* [ABC](xyz)'];
      expect(actual).toEqual(expected);
    });
  });
  describe('replaceContent', () => {
    it('should return updated fileContent with provided links between special comment marks', () => {
      const fileContent = `# Test Readme File
# Table of content
<!-- readme-md-content-generator-begin -->
* [OldCaption](old/path/README.md)
<!-- readme-md-content-generator-end -->
some other content`;
      const links = [
        '* [NewCaption](new/path/to/README.md)',
        '* [NewCaption2](new/path/to2/README.md)',
      ];
      const actual = replaceContent(commentMark, fileContent, links);
      const expected = `# Test Readme File
# Table of content
<!-- readme-md-content-generator-begin -->
* [NewCaption](new/path/to/README.md)
* [NewCaption2](new/path/to2/README.md)
<!-- readme-md-content-generator-end -->
some other content`;
      expect(actual).toEqual(expected);
    });
    it('should add begin mark and return updated fileContent if the begin mark is not found', () => {
      const fileContent = `# Test Readme File
# Table of content
<!--  there's no correct begin mark here  -->
* [OldCaption](old/path/README.md)
<!-- readme-md-content-generator-end -->
some other content`;
      const links = [
        '* [NewCaption](new/path/to/README.md)',
        '* [NewCaption2](new/path/to2/README.md)',
      ];
      const actual = replaceContent(commentMark, fileContent, links);
      const expected = `# Test Readme File
# Table of content
<!--  there's no correct begin mark here  -->
* [OldCaption](old/path/README.md)
<!-- readme-md-content-generator-begin -->
* [NewCaption](new/path/to/README.md)
* [NewCaption2](new/path/to2/README.md)
<!-- readme-md-content-generator-end -->
some other content`;
      expect(actual).toEqual(expected);
    });
    it('should add end mark and return content if the end mark is not found', () => {
      const fileContent = `# Test Readme File
# Table of content
<!-- readme-md-content-generator-begin -->
* [OldCaption](old/path/README.md)
<!-- there's no correct end mark here -->
some other content`;
      const links = [
        '* [NewCaption](new/path/to/README.md)',
        '* [NewCaption2](new/path/to2/README.md)',
      ];
      const actual = replaceContent(commentMark, fileContent, links);
      const expected = `# Test Readme File
# Table of content
<!-- readme-md-content-generator-begin -->
* [NewCaption](new/path/to/README.md)
* [NewCaption2](new/path/to2/README.md)
<!-- readme-md-content-generator-end -->
* [OldCaption](old/path/README.md)
<!-- there's no correct end mark here -->
some other content`;
      expect(actual).toEqual(expected);
    });
    it('should add begin and end marks to the end of the file and return content if no marks are found', () => {
      const fileContent = `# Test Readme File
# Table of content
<!-- no begin mark -->
* [OldCaption](old/path/README.md)
<!-- no end mark -->
some other content`;
      const links = [
        '* [NewCaption](new/path/to/README.md)',
        '* [NewCaption2](new/path/to2/README.md)',
      ];
      const actual = replaceContent(commentMark, fileContent, links);
      const expected = `# Test Readme File
# Table of content
<!-- no begin mark -->
* [OldCaption](old/path/README.md)
<!-- no end mark -->
some other content
<!-- readme-md-content-generator-begin -->
* [NewCaption](new/path/to/README.md)
* [NewCaption2](new/path/to2/README.md)
<!-- readme-md-content-generator-end -->`;
      expect(actual).toEqual(expected);
    });
    it('should return null if the end mark is before begin mark', () => {
      const fileContent = `# Test Readme File
# Table of content
<!-- readme-md-content-generator-end -->
* [OldCaption](old/path/README.md)
<!-- readme-md-content-generator-begin -->
some other content`;
      const links = [
        '* [NewCaption](new/path/to/README.md)',
        '* [NewCaption2](new/path/to2/README.md)',
      ];
      const actual = replaceContent(commentMark, fileContent, links);
      expect(actual).toEqual(null);
    });
  });
  describe('getFiles', () => {
    it('should return a list of paths of found files', () => {
      const root = path.join(__dirname, '..');
      const dir = path.join(root, 'test-files');
      const actual = getFiles(dir, new RegExp('\\.md$'));
      const expected = [
        path.join(dir, 'README.md'),
        path.join(dir, 'dev.md'),
        path.join(dir, 'src', 'js', 'components', 'README.md'),
        path.join(dir, 'src', 'js', 'tests', 'Tests.md'),
      ];
      expect(actual).toEqual(expected);
    });
  });
  describe('readRootReadme', () => {
    it('should return content of the file', () => {
      const root = path.join(__dirname, '..');
      const readmeFilePath = path.join(root, 'test-files', 'README.md');
      const actual = readRootReadme(readmeFilePath);
      const expected = '# Root readme file for testing';
      expect(actual).toEqual(expected);
    });
  });
  describe('writeRootReadme', () => {
    it('should save new content of the file', () => {
      const root = path.join(__dirname, '..');
      const readmeFilePath = path.join(root, 'test-files', 'README.md');
      const original = readRootReadme(readmeFilePath);
      const newContent = 'abc\ndef';
      writeRootReadme(readmeFilePath, newContent);
      const actual = readRootReadme(readmeFilePath);
      expect(actual).toEqual(newContent);
      // restore content
      writeRootReadme(readmeFilePath, original);
      expect(readRootReadme(readmeFilePath)).toEqual(original);
    });
  });

  describe('generateDefaultConfigInPackageJson', () => {
    it('should generate default params and return new json if the key "readmelinks" is not present in package.json', () => {
      const root = path.join(__dirname, '..');
      const testPackageJsonPath = path.join(
        root,
        'test-files',
        'package_without_key.json',
      );
      const testPackageJson = readJson(testPackageJsonPath);
      const actual = generateDefaultConfigInPackageJson(testPackageJson);
      const expectedConfig = [DEFAULT_SETTINGS];
      const expectedScripts = {
        readmelinks: 'readmelinks',
      };
      expect(actual && actual.readmelinks).toEqual(expectedConfig);
      expect(actual.scripts).toEqual(expectedScripts);
    });
    it('should return null if the key "readmelinks" is already present in package.json', () => {
      const root = path.join(__dirname, '..');
      const testPackageJsonPath = path.join(root, 'test-files', 'package.json');
      const testPackageJson = readJson(testPackageJsonPath);
      const actual = generateDefaultConfigInPackageJson(testPackageJson);
      expect(actual).toEqual(null);
    });
  });
  describe('updateRootReadme', () => {
    const root = path.join(__dirname, '..', 'test-files');
    const srcRoot = 'src';
    const readMePath = path.join(root, 'test-readme.md');
    const commentMark = 'test-mark';
    const regexp = '\\.md$';
    const showFileName = false;
    beforeAll(() => {
      // create file
      fs.writeFileSync(readMePath, '');
    });
    afterAll(() => {
      fs.unlinkSync(readMePath);
    });
    it('should update readme file', () => {
      const config: Config = {
        root,
        srcRoot,
        readMePath,
        commentMark,
        regexp,
        showFileName,
      };
      updateRootReadme(config);
      const actual = fs.readFileSync(readMePath, 'utf-8');
      const expected = `
<!-- test-mark-begin -->
* [js/components](src/js/components/README.md)
* [js/tests](src/js/tests/Tests.md)
<!-- test-mark-end -->`;
      expect(actual).toEqual(expected);
    });
    it('should throw error if config.root is not defined', () => {
      const subject = () => {
        updateRootReadme({});
      };
      expect(subject).toThrow('In package.json readmelinks.root is missing');
    });
    it('should throw error if config.srcRoot is not defined', () => {
      const subject = () => {
        updateRootReadme({ root });
      };
      expect(subject).toThrow('In package.json readmelinks.srcRoot is missing');
    });
    it('should throw error if config.srcRoot is not defined', () => {
      const subject = () => {
        updateRootReadme({ root, srcRoot });
      };
      expect(subject).toThrow(
        'In package.json readmelinks.readMePath is missing',
      );
    });
    it('should throw error if config.srcRoot is not defined', () => {
      const subject = () => {
        updateRootReadme({ root, srcRoot, readMePath });
      };
      expect(subject).toThrow(
        'In package.json readmelinks.commentMark is missing',
      );
    });
  });
  describe('writeJson', () => {
    const root = path.join(__dirname, '..', 'test-files');
    const testJsonFile = path.join(root, 'test.json');
    beforeAll(() => {
      // create file
      fs.writeFileSync(testJsonFile, '{}');
    });
    afterAll(() => {
      fs.unlinkSync(testJsonFile);
    });
    it('should write valid json content to the file', () => {
      const content = {
        foo: 'bar',
      };
      writeJson(testJsonFile, content);
      const actual = readJson(testJsonFile);
      expect(actual).toEqual(content);
    });
  });
});
