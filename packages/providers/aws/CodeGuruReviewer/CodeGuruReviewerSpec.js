const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");
const { compareAws } = require("../AwsCommon");

const {
  CodeGuruReviewerRepositoryAssociation,
} = require("./CodeGuruReviewerRepositoryAssociation");

const GROUP = "CodeGuruReviewer";

const tagsKey = "Tags";

const compare = compareAws({
  tagsKey,
  key: "Key",
});

module.exports = pipe([
  () => [
    //
    CodeGuruReviewerRepositoryAssociation({ compare }),
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
