const { OpenStackProvider } = require("@grucloud/provider-openstack");

exports.createStack = async ({ config }) => {
  return {
    stacks: [
      {
        provider: OpenStackProvider({
          config: () => ({}),
        }),
      },
    ],
  };
};
