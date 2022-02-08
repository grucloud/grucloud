const assert = require("assert");
const { MockProvider } = require("@grucloud/provider-mock");
const hookGlobal = require("./hookGlobal");

const createResources1 = () => [
  {
    type: "Volume",
    group: "Compute",
    name: "volume1",
    properties: () => ({
      size: 20_000_000_000,
    }),
  },
];

const createResources2 = () => [
  {
    type: "Volume",
    group: "Compute",
    name: "volume2",
    properties: () => ({
      size: 20_000_000_000,
    }),
  },
];

exports.createStack = ({ config }) => {
  return {
    hookGlobal,
    stacks: [
      {
        provider: MockProvider({
          name: "mock-1",
          createResources: createResources1,
          config: require("./config"),
        }),
        hooks: [require("./hookProvider1")],
        //TODO
        //isProviderUp: () => resources1.volume.getLive(),
      },
      {
        provider: MockProvider({
          name: "mock-2",
          createResources: createResources2,
          //dependencies: { provider1 },
          config: require("./config"),
        }),
        hooks: [require("./hookProvider2")],
      },
    ],
  };
};
