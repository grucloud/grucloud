// Generated by gcp2gc
const { get } = require("rubico");
const { GoogleProvider } = require("@grucloud/provider-google");

const createResources = ({ provider }) => {
  provider.iam.makeServiceAccount({
    name: get("config.iam.ServiceAccount.saSaTestVm.name"),
    properties: get("config.iam.ServiceAccount.saSaTestVm.properties"),
  });

  provider.compute.makeNetwork({
    name: get("config.compute.Network.vpcDev.name"),
    properties: get("config.compute.Network.vpcDev.properties"),
  });

  provider.compute.makeSubNetwork({
    name: get("config.compute.SubNetwork.subnet_subnetworkDev.name"),
    properties: get(
      "config.compute.SubNetwork.subnet_subnetworkDev.properties"
    ),
    dependencies: ({ resources }) => ({
      network: resources.compute.Network.vpcDev,
    }),
  });

  provider.compute.makeFirewall({
    name: get("config.compute.Firewall.firewallDev.name"),
    properties: get("config.compute.Firewall.firewallDev.properties"),
    dependencies: ({ resources }) => ({
      network: resources.compute.Network.vpcDev,
    }),
  });

  provider.compute.makeVmInstance({
    name: get("config.compute.VmInstance.dbDev.name"),
    properties: get("config.compute.VmInstance.dbDev.properties"),
    dependencies: ({ resources }) => ({
      subnetworks: [resources.compute.SubNetwork.subnetworkDev],
    }),
  });
};

exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(GoogleProvider, {
    config: require("./config"),
  });
  createResources({
    provider,
  });

  return {
    provider,
  };
};
