const assert = require("assert");
const { pipe, map, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const {
  NetworkManagerGlobalNetwork,
} = require("./NetworkManagerGlobalNetwork");
const { NetworkManagerCoreNetwork } = require("./NetworkManagerCoreNetwork");

const GROUP = "NetworkManager";
const compareNetworkManager = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "GlobalNetwork",
      Client: NetworkManagerGlobalNetwork,
      compare: compareNetworkManager({
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
      }),
      filterLive: ({ resource, programOptions }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      omitProperties: [
        "GlobalNetworkId",
        "GlobalNetworkArn",
        "State",
        "CreatedAt",
      ],
    },
    {
      type: "CoreNetwork",
      Client: NetworkManagerCoreNetwork,
      compare: compareNetworkManager({
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
      }),
      filterLive: ({ resource, programOptions }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      omitProperties: [
        "GlobalNetworkId",
        "CoreNetworkId",
        "CoreNetworkArn",
        "CreatedAt",
        "State",
        "Segments",
        "Edges",
        "PolicyVersionId",
      ],
      dependencies: { globalNetwork: { type: "GlobalNetwork", group: GROUP } },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compareNetworkManager({}),
    })
  ),
]);
