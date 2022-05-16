const assert = require("assert");
const { MockProvider } = require("@grucloud/provider-mock");
const hookGlobal = require("./hookGlobal");

const createResources1 = () => [
  {
    type: "Server",
    group: "Compute",
    name: "server",
    properties: () => ({
      diskSizeGb: "20",
      machineType: "f1-micro",
    }),
    dependencies: () => ({
      volume: "volume2",
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

exports.createStack = ({ createProvider }) => {
  return {
    //hookGlobal,
    stacks: [
      {
        provider: createProvider(MockProvider, {
          name: "mock-1",
          createResources: createResources1,
          config: require("./config"),
        }),
        //hooks: [require("./hookProvider1")],
        //TODO
        //isProviderUp: () => resources1.volume.getLive(),
      },
      {
        provider: createProvider(MockProvider, {
          name: "mock-2",
          createResources: createResources2,
          //dependencies: { provider1 },
          config: require("./config"),
        }),
        //shooks: [require("./hookProvider2")],
      },
    ],
  };
};
