const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const { CodeCatalystProject } = require("./CodeCatalystProject");
const { CodeCatalystSpace } = require("./CodeCatalystProject");

const GROUP = "CodeCatalyst";

// TODO no tag yet
const tagsKey = "tags";

const compare = compareAws({
  tagsKey,
  key: "key",
});

module.exports = pipe([
  () => [
    //
    CodeCatalystProject({ compare }),
    CodeCatalystSpace({ compare }),
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
