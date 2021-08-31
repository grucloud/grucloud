// Generated by gcp2gc
const { get } = require("rubico");
const { GoogleProvider } = require("@grucloud/provider-google");

const createResources = ({ provider }) => {
  provider.iam.makePolicy({
    name: get("config.iam.Policy.policy.name"),
    properties: get("config.iam.Policy.policy.properties"),
  });

  provider.iam.makeBinding({
    name: get("config.iam.Binding.rolesComputeAdmin.name"),
    properties: get("config.iam.Binding.rolesComputeAdmin.properties"),
  });

  provider.iam.makeBinding({
    name: get("config.iam.Binding.rolesComputeServiceAgent.name"),
    properties: get("config.iam.Binding.rolesComputeServiceAgent.properties"),
  });

  provider.iam.makeBinding({
    name: get("config.iam.Binding.rolesComputeViewer.name"),
    properties: get("config.iam.Binding.rolesComputeViewer.properties"),
  });

  provider.iam.makeBinding({
    name: get("config.iam.Binding.rolesDnsAdmin.name"),
    properties: get("config.iam.Binding.rolesDnsAdmin.properties"),
  });

  provider.iam.makeBinding({
    name: get("config.iam.Binding.rolesIamServiceAccountAdmin.name"),
    properties: get(
      "config.iam.Binding.rolesIamServiceAccountAdmin.properties"
    ),
  });

  provider.iam.makeBinding({
    name: get("config.iam.Binding.rolesOwner.name"),
    properties: get("config.iam.Binding.rolesOwner.properties"),
  });

  provider.iam.makeBinding({
    name: get("config.iam.Binding.rolesResourcemanagerProjectIamAdmin.name"),
    properties: get(
      "config.iam.Binding.rolesResourcemanagerProjectIamAdmin.properties"
    ),
  });

  provider.iam.makeBinding({
    name: get("config.iam.Binding.rolesStorageAdmin.name"),
    properties: get("config.iam.Binding.rolesStorageAdmin.properties"),
  });

  provider.iam.makeBinding({
    name: get("config.iam.Binding.rolesStorageObjectAdmin.name"),
    properties: get("config.iam.Binding.rolesStorageObjectAdmin.properties"),
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
