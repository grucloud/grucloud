const assert = require("assert");
const { tap, pipe, map, get, switchCase, omit } = require("rubico");
const {
  defaultsDeep,
  append,
  values,
  first,
  isEmpty,
  when,
  prepend,
  callProp,
} = require("rubico/x");

const {
  isOurMinion,
  compareAws,
  assignValueFromConfig,
} = require("../AwsCommon");
const { RAMResourceShare } = require("./RAMResourceShare");
const {
  RAMPrincipalAssociation,
  PrincipalAssociationDependencies,
} = require("./RAMPrincipalAssociation");
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
      dependencies: {
        resourceShare: {
          type: "ResourceShare",
          group: "RAM",
          dependencyId: ({ lives, config }) => get("resourceShareArn"),
        },
        ...PrincipalAssociationDependencies,
      },
      includeDefaultDependencies: true,
      Client: RAMPrincipalAssociation,
      inferName: ({
        properties: { associatedEntity },
        dependenciesSpec: { resourceShare, ...dependencies },
      }) =>
        pipe([
          tap((params) => {
            // assert(associatedEntity);
            assert(resourceShare);
            assert(dependencies);
          }),
          () => dependencies,
          values,
          first,
          when(isEmpty, () => associatedEntity),
          prepend(`ram-principal-assoc::${resourceShare}::`),
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
          switchCase([
            pipe([
              get("associatedEntity"),
              callProp("startsWith", "arn:aws:organizations"),
            ]),
            omit(["associatedEntity"]),
            assignValueFromConfig({ providerConfig, key: "associatedEntity" }),
          ]),
        ]),
    },
    {
      type: "ResourceAssociation",
      dependencies: {
        resourceShare: {
          type: "ResourceShare",
          group: "RAM",
          dependencyId: ({ lives, config }) => get("resourceShareArn"),
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
