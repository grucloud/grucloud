const assert = require("assert");
const path = require("path");

const { walkDirectory } = require("../WalkDirectory");

const { map, pipe, tap, get, assign } = require("rubico");

const defaultDirectory = "../../../examples/aws/APIGateway";
const exampleDirectory = "../../../examples/aws";

describe("walkDirectory", function () {
  it("walkDirectory APIGateway ", () =>
    pipe([
      () => path.resolve(process.cwd(), defaultDirectory),
      walkDirectory({}),
      tap((arn) => {
        assert(true);
      }),
    ])());
  it("walkDirectory All", () =>
    pipe([
      () => path.resolve(process.cwd(), exampleDirectory),
      walkDirectory({}),
      tap((arn) => {
        assert(true);
      }),
    ])());
});
