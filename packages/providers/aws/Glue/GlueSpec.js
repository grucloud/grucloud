const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { GlueJob } = require("./GlueJob");

const GROUP = "Glue";

const tagsKey = "Tags";

const compareJob = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    {
      type: "Job",
      Client: GlueJob,
      omitProperties: [
        "CreatedOn",
        "LastModifiedOn",
        "AllocatedCapacity",
        "MaxCapacity",
        "Role",
      ],
      propertiesDefault: {},
      dependencies: { role: { type: "Role", group: "IAM" } },
      compare: compareJob({}),
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      tagsKey,
      compare: compareJob({}),
    })
  ),
]);
