const { get } = require("rubico");

const K8sClient = require("./K8sClient");
const { buildTagsObject } = require("../Common");

exports.createResourceNamespaceless = ({
  baseUrl,
  configKey,
  apiVersion,
  kind,
  cannotBeDeleted,
}) => ({ spec, config }) => {
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: get(`${configKey}.apiVersion`, apiVersion)(config),
      kind,
      metadata: {
        name,
        annotations: buildTagsObject({ name, config }),
      },
    })(properties);

  const pathGet = ({ name }) => `${baseUrl}/${name}`;
  const pathList = () => baseUrl;
  const pathCreate = () => baseUrl;
  const pathUpdate = ({ name }) => `${baseUrl}/${name}`;
  const pathDelete = ({ name }) => `${baseUrl}/${name}`;

  return K8sClient({
    spec,
    config,
    pathGet,
    pathList,
    pathCreate,
    pathUpdate,
    pathDelete,
    configDefault,
    cannotBeDeleted,
  });
};
