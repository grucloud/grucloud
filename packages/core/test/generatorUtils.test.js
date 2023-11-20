const assert = require("assert");
const { pipe } = require("rubico");
const { formatContent } = require("../generatorUtils");

describe("generatorUtils", function () {
  it("formatContent exp1", () =>
    pipe([
      formatContent({ content: "const a = 1;a++\n" }),
      (result) => {
        assert.equal(result, "const a = 1;\na++;\n");
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
