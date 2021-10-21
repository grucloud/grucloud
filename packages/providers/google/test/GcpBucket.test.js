const path = require("path");
const assert = require("assert");
const chance = require("chance")();
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { Cli } = require("@grucloud/core/cli/cliCommands");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("GcpBucket", async function () {
  const types = ["Bucket", "Object"];
  const bucketName = `mybucket-test-${chance.guid()}`;
  const bucketNamePublic = `grucloud-test-bucket`;
  const objectName = `mypath/myfile`;
  let config;
  let provider;
  let bucket;
  let bucketPublic;

  let file;
  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = GoogleProvider({
      config: () => ({
        projectId: "grucloud-test",
      }),
    });

    bucket = provider.storage.makeBucket({
      name: bucketName,
      properties: () => ({}),
    });

    bucketPublic = provider.storage.makeBucket({
      name: bucketNamePublic,
      properties: () => ({
        iamConfiguration: {
          uniformBucketLevelAccess: {
            enabled: true,
          },
        },
        iam: {
          bindings: [
            {
              role: "roles/storage.objectViewer",
              members: ["allUsers"],
            },
          ],
        },
        website: { mainPageSuffix: "index.html", notFoundPage: "404.html" },
      }),
    });
    file = provider.storage.makeObject({
      name: objectName,
      dependencies: { bucket: bucket },
      properties: () => ({
        path: "/",
        source: path.join(process.cwd(), "./test/fixtures/testFile.txt"),
      }),
    });
  });
  after(async () => {});
  it.skip("gcp bucket apply and destroy", async function () {
    await testPlanDeploy({ provider, types });

    {
      const provider = GoogleProvider({
        config: () => ({
          projectId: "grucloud-test",
        }),
      });

      const cli = await Cli({
        createStack: () => ({
          provider,
        }),
      });

      const bucket = provider.storage.makeBucket({
        name: bucketName,
        properties: () => ({}),
      });

      const file = provider.storage.makeObject({
        name: objectName,
        dependencies: { bucket: bucket },
        properties: () => ({
          path: "/",
          source: path.join(process.cwd(), "./test/fixtures/testFile2.txt"),
        }),
      });
      {
        const { error, resultQuery } = await cli.planQuery({
          commandOptions: { force: true },
        });
        assert(!error);
        const plan = resultQuery.results[0];
        assert.equal(plan.resultCreate.length, 1);
        assert.equal(plan.resultCreate[0].action, "UPDATE");
      }

      const resultApply = await cli.planApply({
        commandOptions: { force: true },
      });
      assert(!resultApply.error);
    }
    await testPlanDestroy({ provider, types });
  });
});
