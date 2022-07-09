const assert = require("assert");
const { tap, pipe, map, assign, get } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
const { replaceWithName } = require("@grucloud/core/Common");

const { isOurMinion, compareAws, replaceRegion } = require("../AwsCommon");
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
      dependencies: {
        cells: { type: "Cell", group: GROUP, list: true },
      },
      omitProperties: ["CellArn", "ParentReadinessScopes", "Cells"],
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          assign({
            CellName: pipe([
              get("CellName"),
              replaceRegion({ providerConfig }),
            ]),
          }),
        ]),
    },
    {
      type: "ReadinessCheck",
      Client: Route53RecoveryReadinessReadinessCheck,
      dependencies: { resourceSet: { type: "ResourceSet", group: GROUP } },
      inferName: pipe([get("properties.ReadinessCheckName")]),
      omitProperties: ["ReadinessCheckArn", "ResourceSetName"],
    },
    {
      type: "RecoveryGroup",
      Client: Route53RecoveryReadinessRecoveryGroup,
      dependencies: { cells: { type: "Cell", group: GROUP, list: true } },
      inferName: get("properties.RecoveryGroupName"),
      omitProperties: ["RecoveryGroupArn", "Cells"],
    },
    {
      type: "ResourceSet",
      Client: Route53RecoveryReadinessResourceSet,
      dependencies: {
        cells: { type: "Cell", group: "Route53RecoveryReadiness", list: true },
        ...ResourceSetDependencies,
      },
      inferName: get("properties.ResourceSetName"),
      omitProperties: ["ResourceSetArn"],
      filterLive:
        ({ lives, providerConfig }) =>
        (live) =>
          pipe([
            () => live,
            assign({
              Resources: pipe([
                get("Resources"),
                map(
                  assign({
                    ReadinessScopes: pipe([
                      get("ReadinessScopes"),
                      map(
                        replaceWithName({
                          groupType: "Route53RecoveryReadiness::Cell",
                          providerConfig,
                          lives,
                          path: "id",
                        })
                      ),
                    ]),
                    ResourceArn: pipe([
                      get("ResourceArn"),
                      replaceWithName({
                        groupType: pipe([
                          () => live.ResourceSetType,
                          callProp("replace", "AWS::", ""),
                        ])(),
                        providerConfig,
                        lives,
                        path: "id",
                      }),
                    ]),
                  })
                ),
              ]),
            }),
          ])(),
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
