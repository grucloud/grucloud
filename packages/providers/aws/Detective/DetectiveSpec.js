const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html

// const { DetectiveGraph } = require("./DetectiveGraph");
// const { DetectiveInvitation } = require("./DetectiveInvitation");
// const { DetectiveMember } = require("./DetectiveMember");

const GROUP = "Detective";

const compare = compareAws({});

module.exports = pipe([
  () => [
    //
    // DetectiveGraph({ compare }),
    // DetectiveInvitation({}),
    // DetectiveMember({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
