const assert = require("assert");
const { get, eq } = require("rubico");
const { find } = require("rubico/x");
module.exports = ({ stacks }) => {
  assert(stacks);
  const stack1 = find(eq(get("provider.name"), "mock-1"))(stacks);
  assert(stack1);
  //const { volume } = stack1.resources;
  //assert(volume);
  return {
    name: "mock",
    onDeployed: {
      init: async () => {
        // const volumeLive = await volume.getLive();
        // assert(volumeLive);

        return {
          //volumeLive,
        };
      },
      actions: [
        {
          name: "Volume test",
          command: async ({ volumeLive }) => {
            assert(true);
          },
        },
      ],
    },
    onDestroyed: {
      init: async () => {},
      actions: [
        {
          name: "Check Ping KO",
          command: async () => {},
        },
      ],
    },
  };
};
