const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const {
  Route53RecoveryReadinessCell,
} = require("./Route53RecoveryReadinessCell");
const {
  Route53RecoveryReadinessRecoveryGroup,
} = require("./Route53RecoveryReadinessRecoveryGroup");

const {
  Route53RecoveryReadinessReadinessCheck,
} = require("./Route53RecoveryReadinessReadinessCheck");

const {
  Route53RecoveryReadinessResourceSet,
} = require("./Route53RecoveryReadinessResourceSet");

const GROUP = "Route53RecoveryReadiness";

const compare = compareAws({});

module.exports = pipe([
  () => [
    Route53RecoveryReadinessCell({}),
    Route53RecoveryReadinessReadinessCheck({}),
    Route53RecoveryReadinessRecoveryGroup({}),
    Route53RecoveryReadinessResourceSet({}),
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
