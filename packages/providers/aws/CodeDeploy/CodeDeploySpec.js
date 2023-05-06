const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const { CodeDeployApplication } = require("./CodeDeployApplication");
const { CodeDeployDeploymentGroup } = require("./CodeDeployDeploymentGroup");

const GROUP = "CodeDeploy";
const tagsKey = "tags";
const compare = compareAws({
  tagsKey,
  key: "Key",
});

module.exports = pipe([
  () => [
    //
    CodeDeployApplication({ compare }),
    CodeDeployDeploymentGroup({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        compare: compare({}),
      }),
    ])
  ),
]);
