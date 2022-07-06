const assert = require("assert");
const { tap, pipe, map, assign, eq, get, fork, omit, and } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinion, compareAws } = require("../AwsCommon");
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
  ResourceSetDependencies,
} = require("./Route53RecoveryReadinessResourceSet");

const GROUP = "Route53RecoveryReadiness";

const compareRoute53RecoveryReadiness = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "Cell",
      Client: Route53RecoveryReadinessCell,
      inferName: get("properties.CellName"),
      dependencies: { cells: { type: "Cell", group: GROUP, list: true } },
      omitProperties: ["CellArn"],
    },
    {
      type: "ReadinessCheck",
      Client: Route53RecoveryReadinessReadinessCheck,
      dependencies: { resourceSet: { type: "ResourceSet", group: GROUP } },
      inferName: get("properties.ReadinessCheckName"),
      omitProperties: ["ReadinessCheckName", "ResourceSet"],
    },
    {
      type: "RecoveryGroup",
      Client: Route53RecoveryReadinessRecoveryGroup,
      dependencies: { cells: { type: "Cell", group: GROUP, list: true } },
      inferName: get("properties.RecoveryGroupName"),
      omitProperties: ["RecoveryGroupArn"],
    },
    {
      type: "ResourceSet",
      Client: Route53RecoveryReadinessResourceSet,
      dependencies: ResourceSetDependencies,
      inferName: get("properties.ResourceSetName"),
      omitProperties: [],
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      compare: compareRoute53RecoveryReadiness({}),
    })
  ),
]);
