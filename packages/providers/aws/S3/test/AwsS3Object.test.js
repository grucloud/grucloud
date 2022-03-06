const assert = require("assert");
const path = require("path");
const { tap, pipe, get, tryCatch } = require("rubico");

const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { Cli } = require("@grucloud/core/cli/cliCommands");

const { buildTagsS3Object } = require("../AwsS3Object");

const bucketName = "grucloud-s3bucket-test-update";
const types = ["Bucket", "Object"];
const createStack = async ({ config }) => {
  const provider = AwsProvider({
    config: () => ({ projectName: "gru-test" }),
  });

  const s3Bucket = provider.S3.makeBucket({
    name: bucketName,
    properties: () => ({}),
  });

  const s3Object = provider.S3.makeObject({
    name: `file-test`,
    dependencies: { bucket: s3Bucket },
    properties: () => ({
      ACL: "public-read",
      ContentType: "text/plain",
      source: path.join(process.cwd(), "./S3/test/fixtures/testFile.txt"),
    }),
  });

  return provider;
};

const createStackNext = async ({ config }) => {
  const provider = AwsProvider({
    config: () => ({ projectName: "gru-test" }),
  });

  const s3Bucket = provider.S3.makeBucket({
    name: bucketName,
    properties: () => ({}),
  });

  const s3Object = provider.S3.makeObject({
    name: `file-test`,
    dependencies: { bucket: s3Bucket },
    properties: () => ({
      ACL: "public-read",
      ContentType: "text/plain",
      source: path.join(process.cwd(), "./S3/test/fixtures/testFile2.txt"),
    }),
  });

  return provider;
};
describe.skip("AwsS3Object", async function () {
  let config;

  it("destroy NoSuchBucket", async function () {
    await pipe([
      () =>
        AwsProvider({
          config: () => ({ projectName: "gru-test" }),
        }),
      (provider) => provider.getClient({ groupType: "S3::Object" }),
      tryCatch(
        (s3Object) =>
          s3Object.destroy({
            live: { Bucket: "grucloud-i-do-not-exist", Key: "bla" },
          }),
        (error) =>
          pipe([
            tap(() => {
              assert(error);
              assert(false, "shoud not be here");
            }),
          ])()
      ),
    ])();
  });

  it("buildTagsS3Object default", async function () {
    await pipe([
      tap((params) => {
        assert(true);
      }),
      () => createStack({ config }),
      get("config"),
      (config) => buildTagsS3Object({ config }),
      tap((result) => {
        assert.equal(
          result,
          "gc-managed-by=grucloud&gc-stage=dev&gc-created-by-provider=aws&gc-namespace=&gc-project-name=gru-test"
        );
      }),
    ])();
  });
  it("buildTag buildTagsS3Object", async function () {
    await pipe([
      tap((params) => {
        assert(true);
      }),
      () => createStack({ config }),
      get("config"),
      (config) =>
        buildTagsS3Object({
          config,
          Tags: [
            {
              Key: "Key1",
              Value: "Value1",
            },
          ],
        }),
      tap((result) => {
        assert.equal(
          result,
          "gc-managed-by=grucloud&gc-stage=dev&gc-created-by-provider=aws&gc-namespace=&gc-project-name=gru-test&Key1=Value1"
        );
      }),
    ])();
  });
  it("s3 object apply, update destroy", async function () {
    const provider = await createStack({ config });

    await testPlanDeploy({ provider, types });

    await pipe([
      () => provider.getClient({ groupType: "S3::Object" }),
      tryCatch(
        (s3Object) =>
          s3Object.destroy({
            live: { Bucket: bucketName, Key: "bla" },
          }),
        (error) =>
          pipe([
            tap(() => {
              assert(error);
              assert(false, "shoud not be here");
            }),
          ])()
      ),
    ])();

    const providerNext = await createStackNext({ config });
    const cli = await Cli({
      createStack: () => ({
        provider: providerNext,
      }),
    });
    {
      const result = await cli.planQuery({
        commandOptions: {},
      });

      assert(!result.error);
      const plan = result.resultQuery.results[0];
      assert.equal(plan.resultDestroy.length, 0);
      assert.equal(plan.resultCreate.length, 1);
      const update = plan.resultCreate[0];
      assert.equal(update.action, "UPDATE");
    }

    await testPlanDestroy({ provider, types });
  });
});
