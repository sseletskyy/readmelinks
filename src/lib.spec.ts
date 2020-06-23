const { applyFormat, generateLinks, replaceContent } = require("./lib");

describe("ReadmeLinkGenerator", () => {
  describe("generateLinks", () => {
    const files: string[] = [
      "/Users/cw2930/projects/cw-buyer/app/assets/client/components/Pagination/README.md",
      "/Users/cw2930/projects/cw-buyer/app/assets/layout/components/Footer/README.md",
    ];
    const root = "/Users/cw2930/projects/cw-buyer";
    const srcRoot = "/Users/cw2930/projects/cw-buyer/app";
    let subject: string[];
    beforeAll(() => {
      subject = generateLinks(root, srcRoot, files);
    });
    it("should return relative folder path as the caption of the link", () => {
      expect(subject[0]).toContain("[assets/client/components/Pagination]");
      expect(subject[1]).toContain("[assets/layout/components/Footer]");
    });
    it("should return relative path as the link to the file", () => {
      expect(subject[0]).toContain(
        "(app/assets/client/components/Pagination/README.md)"
      );
      expect(subject[1]).toContain(
        "(app/assets/layout/components/Footer/README.md)"
      );
    });
  });
  describe("applyFormat", () => {
    it("should decorate each link according to formatter function", () => {
      const formatter = (x: string) => `* ${x}`;
      const links = ["[ABC](xyz)"];
      const actual = applyFormat(links, formatter);
      const expected = ["* [ABC](xyz)"];
      expect(actual).toEqual(expected);
    });
  });
  describe("replaceContent", () => {
    it("should return updated fileContent with provided links between special comment marks", () => {
      const fileContent = `# Test Readme File
# Table of content
<!-- readme-md-content-generator-begin -->
* [OldCaption](old/path/README.md)
<!-- readme-md-content-generator-end -->
some other content`;
      const links = [
        "* [NewCaption](new/path/to/README.md)",
        "* [NewCaption2](new/path/to2/README.md)",
      ];
      const actual = replaceContent(fileContent, links);
      const expected = `# Test Readme File
# Table of content
<!-- readme-md-content-generator-begin -->
* [NewCaption](new/path/to/README.md)
* [NewCaption2](new/path/to2/README.md)
<!-- readme-md-content-generator-end -->
some other content`;
      expect(actual).toEqual(expected);
    });
    it("should return null if the begin mark is not found", () => {
      const fileContent = `# Test Readme File
# Table of content
<!--  there's no correct begin mark here  -->
* [OldCaption](old/path/README.md)
<!-- readme-md-content-generator-end -->
some other content`;
      const links = [
        "* [NewCaption](new/path/to/README.md)",
        "* [NewCaption2](new/path/to2/README.md)",
      ];
      const actual = replaceContent(fileContent, links);
      expect(actual).toEqual(null);
    });
    it("should return null if the end mark is not found", () => {
      const fileContent = `# Test Readme File
# Table of content
<!-- readme-md-content-generator-begin -->
* [OldCaption](old/path/README.md)
<!-- there's no correct end mark here -->
some other content`;
      const links = [
        "* [NewCaption](new/path/to/README.md)",
        "* [NewCaption2](new/path/to2/README.md)",
      ];
      const actual = replaceContent(fileContent, links);
      expect(actual).toEqual(null);
    });
    it("should return null if the end mark is before begin mark", () => {
      const fileContent = `# Test Readme File
# Table of content
<!-- readme-md-content-generator-end -->
* [OldCaption](old/path/README.md)
<!-- readme-md-content-generator-begin -->
some other content`;
      const links = [
        "* [NewCaption](new/path/to/README.md)",
        "* [NewCaption2](new/path/to2/README.md)",
      ];
      const actual = replaceContent(fileContent, links);
      expect(actual).toEqual(null);
    });
  });
});
