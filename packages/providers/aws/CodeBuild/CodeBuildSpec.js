const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const { CodeBuildProject } = require("./CodeBuildProject");
const { CodeBuildReportGroup } = require("./CodeBuildReportGroup");

const GROUP = "CodeBuild";

const tagsKey = "tags";

const compare = compareAws({
  tagsKey,
  key: "key",
  getTargetTags: () => [],
  getLiveTags: () => [],
});

module.exports = pipe([
  () => [
    //
    CodeBuildProject({ compare }),
    CodeBuildReportGroup({ compare }),
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
