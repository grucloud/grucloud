const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const {
  isOurMinion,
  compareAws,
  assignValueFromConfig,
} = require("../AwsCommon");
const { RAMResourceShare } = require("./RAMResourceShare");
const { RAMPrincipalAssociation } = require("./RAMPrincipalAssociation");

const GROUP = "RAM";

const compareRAM = compareAws({ tagsKey: "tags", key: "key" });

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
  ],
  map(defaultsDeep({ group: GROUP, isOurMinion, compare: compareRAM({}) })),
]);
