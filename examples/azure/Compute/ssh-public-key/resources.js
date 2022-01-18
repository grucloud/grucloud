// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

const createResources = ({ provider }) => {
  provider.Compute.makeSshPublicKey({
    name: "rg-ssh-public-key::my-key-pair",
    properties: ({}) => ({
      publicKeyFile: "keys/my-key-pair.pub",
    }),
    dependencies: ({ resources }) => ({
      resourceGroup: resources.Resources.ResourceGroup["rg-ssh-public-key"],
    }),
  });

  provider.Resources.makeResourceGroup({
    name: "rg-ssh-public-key",
  });
};

exports.createResources = createResources;
