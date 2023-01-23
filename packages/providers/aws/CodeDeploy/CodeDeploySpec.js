const assert = require("assert");
const { tap, pipe, map, get, assign, flatMap } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const { CodeDeployApplication } = require("./CodeDeployApplication");
const { CodeDeployDeploymentGroup } = require("./CodeDeployDeploymentGroup");

const GROUP = "CodeDeploy";
const tagsKey = "tags";
const compare = compareAws({
  tagsKey,
  // getTargetTags: () => [],
  // getLiveTags: () => [],
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
