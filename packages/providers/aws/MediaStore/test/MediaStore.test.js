const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["MediaStore"] });

describe("MediaStore", async function () {
  it("Container", () =>
    pipe([
      () => ({
        config,
        groupType: "MediaStore::Container",
        livesNotFound: ({ config }) => [{ ContainerName: "c123" }],
      }),
      awsResourceTest,
    ])());
});
