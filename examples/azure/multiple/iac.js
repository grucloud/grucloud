const { pipe, map, get } = require("rubico");
const { AzureProvider } = require("@grucloud/provider-azure");

exports.createStack = ({ createProvider }) => {
  return {
    provider: createProvider(AzureProvider, {
      createResources: pipe([
        () => [
          require("../ContainerService/aks-basic/resources"),
          //require("../Compute/vm/resources"),
          require("../Compute/vm-ad-login/resources"),
          require("../Compute/vm-disks/resources"),
          //require("../Compute/vm-managed-identity/resources"),
          //require("../Compute/virtual-machine-scale-set/resources"),
          require("../DBforPostgreSQL/azure-postgresql/resources"),
          require("../Network/load-balancer/resources"),
          require("../Network/nat-gateway/resources"),
          //require("../Storage/website/resources"),
          require("../Web/containerapps/plantuml/resources"),
        ],
        map(get("createResources")),
      ])(),
      config: require("./config"),
    }),
    hooks: [require("./hook")],
  };
};
