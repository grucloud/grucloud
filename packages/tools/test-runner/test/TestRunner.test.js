const assert = require("assert");
const path = require("path");

const { walkDirectory } = require("../WalkDirectory");
const { testRunner, environments } = require("../TestRunner");

const { map, pipe, tap, get, assign } = require("rubico");

const defaultDirectory = "../../../examples/aws/APIGateway";

describe("TestRunner", function () {
  it.only("test runner", () =>
    pipe([
      () => [
        { name: "apigw-api-key" },
        { name: "apigw-canary-deployment-cdk" },
        { name: "apigw-client-certificate" },
      ],
      map(
        assign({
          directory: pipe([
            get("name"),
            (name) => path.resolve(defaultDirectory, name),
          ]),
        })
      ),
      testRunner({
        command: "gc plan",
        environments,
      }),
    ])());
  it("list dir", () =>
    pipe([
      () => path.resolve(process.cwd(), defaultDirectory),
      walkDirectory({}),
      tap((arn) => {
        assert(true);
      }),
    ])());
});
