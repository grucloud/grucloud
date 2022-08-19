const assert = require("assert");
const path = require("path");

const { pipe, tap, get, eq, tryCatch } = require("rubico");

const { SpecGroupDirs } = require("../../AzureSpecDirs");

const { processSwaggerFiles, processSwagger } = require("../AzureRestApi");

//const specDir = "node_modules/azure-rest-api-specs/specification/";
const specDir = "../../../../../azure-rest-api-specs/specification/";

describe("AzureRestApi", function () {
  before(async function () {});

  it.skip("processSwagger compute", async function () {
    await pipe([
      () => ({
        name: "compute.json",
      }),
      processSwagger({
        dir: path.resolve(
          process.cwd(),
          specDir,
          "compute/resource-manager/Microsoft.Compute/ComputeRP/stable/2021-07-01"
        ),
        group: "Microsoft.Compute",
        groupDir: "compute",
        apiVersion: "2021-07-01",
      }),
      tap((params) => {
        assert(true);
      }),
    ])();
  });

  it.skip("processSwagger webapp", async function () {
    await pipe([
      () => ({
        name: "WebApps.json",
      }),
      processSwagger({
        dir: path.resolve(
          process.cwd(),
          specDir,
          "web/resource-manager/Microsoft.Web/stable/2021-02-01"
        ),
        group: "Microsoft.Web",
        groupDir: "web",
        apiVersion: "2021-02-01",
      }),
      tap((params) => {
        assert(true);
      }),
    ])();
  });
  it.only("processSwaggerFiles", async function () {
    await pipe([
      tryCatch(
        pipe([
          () => ({
            directorySpec: path.resolve(process.cwd(), specDir),
            directoryDoc: path.resolve(
              process.cwd(),
              "../../../../docusaurus/docs/azure/resources/"
            ),
            outputSchemaFile: path.resolve(
              process.cwd(),
              "../",
              "schema",
              `AzureSchema.json`
            ),
            filterDirs: SpecGroupDirs,
          }),
          processSwaggerFiles,
        ]),
        (error) => {
          //assert(false, `error generating ${group}`);
          throw error;
        }
      ),
      tap((params) => {
        assert(true);
      }),
    ])();
  });
});
