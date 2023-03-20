const assert = require("assert");
const { pipe, tap, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");
const { compareAws } = require("../AwsCommon");

const { CloudFormationStack } = require("./CloudFormationStack");
const { CloudFormationStackSet } = require("./CloudFormationStackSet");
const { CloudFormationType } = require("./CloudFormationType");

const GROUP = "CloudFormation";

const compare = compareAws({});

module.exports = pipe([
  () => [
    CloudFormationStack({}),
    CloudFormationStackSet({}),
    CloudFormationType({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({ group: GROUP, compare: compare({}) }),
    ])
  ),
]);
