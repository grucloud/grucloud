const assert = require("assert");
const { tap, pipe, map, get, switchCase } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");

const {
  isOurMinion,
  compareAws,
  assignValueFromConfig,
} = require("../AwsCommon");
const { RAMResourceShare } = require("./RAMResourceShare");
const { RAMPrincipalAssociation } = require("./RAMPrincipalAssociation");
const {
  RAMResourceAssociation,
  RamResourceDependencies,
} = require("./RAMResourceAssociation");

const GROUP = "RAM";
const tagsKey = "tags";
const compareRAM = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    {
      type: "ResourceShare",
      dependencies: {},
      Client: RAMResourceShare,
      omitProperties: [
        "creationTime",
        "lastUpdatedTime",
        "owningAccountId",
        "resourceShareArn",
        "status",
      ],
      inferName: get("properties.name"),
    },
    {
      type: "PrincipalAssociation",
      dependencies: { resourceShare: { type: "ResourceShare", group: "RAM" } },
      Client: RAMPrincipalAssociation,
      inferName: ({
        properties: { associatedEntity },
        dependenciesSpec: { resourceShare },
      }) =>
        pipe([
          tap((params) => {
            assert(associatedEntity);
            assert(resourceShare);
          }),
          () => `ram-principal-assoc::${resourceShare}::${associatedEntity}`,
        ])(),
      omitProperties: [
        "creationTime",
        "lastUpdatedTime",
        "associationType",
        "resourceShareName",
        "resourceShareArn",
        "status",
      ],
      filterLive: ({ providerConfig }) =>
        pipe([
          assignValueFromConfig({ providerConfig, key: "associatedEntity" }),
        ]),
    },
    {
      type: "ResourceAssociation",
      dependencies: {
        resourceShare: {
          type: "ResourceShare",
          group: "RAM",
        },
        ...RamResourceDependencies,
      },
      Client: RAMResourceAssociation,
      inferName: ({
        dependenciesSpec: {
          resourceShare,
          subnet,
          ipamPool,
          resolverRule,
          transitGateway,
        },
      }) =>
        pipe([
          tap((params) => {
            assert(resourceShare);
          }),
          () => `ram-resource-assoc::${resourceShare}::`,
          switchCase([
            () => subnet,
            append(subnet),
            () => ipamPool,
            append(ipamPool),
            () => resolverRule,
            append(resolverRule),
            () => transitGateway,
            append(transitGateway),
            () => {
              assert(false, "missing RAMResourceAssociation dependencies");
            },
          ]),
        ])(),
      omitProperties: [
        "associatedEntity",
        "creationTime",
        "lastUpdatedTime",
        "associationType",
        "resourceShareName",
        "resourceShareArn",
        "status",
      ],
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      compare: compareRAM({}),
      tagsKey,
    })
  ),
]);
