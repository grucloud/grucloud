const { eq, tap, pipe, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const logger = require("../../logger")({ prefix: "K8sNamespace" });
const { tos } = require("../../tos");
const { buildTagsObject } = require("../Common");
const K8sClient = require("./K8sClient");
const {
  displayNameDefault,
  displayNameResourceDefault,
  resourceKeyDefault,
} = require("./K8sCommon");

exports.K8sNamespace = ({ spec, config }) => {
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: "v1",
      kind: "Namespace",
      metadata: {
        name,
        annotations: buildTagsObject({ name, config }),
      },
    })(properties);

  const pathGet = ({ name }) => `/api/v1/namespaces/${name}`;
  const pathList = () => `/api/v1/namespaces`;
  const pathCreate = () => `/api/v1/namespaces/`;
  const pathDelete = ({ name }) => `/api/v1/namespaces/${name}`;

  const cannotBeDeleted = eq(get("name"), "default");

  return K8sClient({
    spec,
    config,
    pathGet,
    pathList,
    pathCreate,
    pathDelete,
    configDefault,
    cannotBeDeleted,
    displayName: displayNameDefault,
    displayNameResource: displayNameResourceDefault,
    resourceKey: resourceKeyDefault,
  });
};
