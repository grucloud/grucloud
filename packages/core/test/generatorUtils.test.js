const assert = require("assert");
const { pipe } = require("rubico");
const { formatContent } = require("../generatorUtils");

describe("generatorUtils", function () {
  it("formatContent exp1", () =>
    pipe([
      formatContent({ content: "console.log('toto');const a=1;\n" }),
      (result) => {
        assert.equal(result, 'console.log("toto");\n');
      },
    ])());
  it("formatContent remove unused variable", () =>
    pipe([
      formatContent({ content: "const a = 1;" }),
      (result) => {
        assert.equal(result, "");
      },
    ])());
});
