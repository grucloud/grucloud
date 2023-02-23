const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const { CodeCommitRepository } = require("./CodeCommitRepository");

const GROUP = "CodeCommit";

const tagsKey = "tags";

const compare = compareAws({
  tagsKey,
  key: "key",
});

module.exports = pipe([
  () => [
    //
    CodeCommitRepository({ compare }),
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
