const { K8sProvider } = require("@grucloud/provider-k8s");
const CrunchyPostgres = require("../iac");

exports.createStack = ({ createProvider }) => ({
  provider: createProvider(K8sProvider, {
    createResources: [
      ({ provider }) => {
        provider.makeNamespace({
          properties: ({}) => ({
            metadata: {
              name: "pgo",
            },
          }),
        });
      },
      CrunchyPostgres.createResources,
    ],
    //config: require("./config"),
  }),
});
