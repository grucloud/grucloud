const assert = require("assert");
const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

module.exports = ({ resources, provider }) => {
  return {
    onDeployed: {
      init: async () => {
        const keyVaultName = "gc-vault-rbac";
        const keyVaultUri = `https://${keyVaultName}.vault.azure.net`;
        const secretName = "my-secret";

        // Authenticate to Azure
        // const credential = new DefaultAzureCredential();
        // const client = new SecretClient(keyVaultUri, credential);

        // const secret = await client.getSecret(secretName);

        return {};
      },
      actions: [
        {
          name: "TODO",
          command: async ({}) => {},
        },
      ],
    },

    onDestroyed: {
      init: async () => {
        return {};
      },
      actions: [
        {
          name: "Perform check",
          command: async ({}) => {},
        },
      ],
    },
  };
};
