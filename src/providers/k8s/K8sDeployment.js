const { eq, tap, pipe, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const logger = require("../../logger")({ prefix: "K8sDeployment" });
const { tos } = require("../../tos");
const { buildTagsObject } = require("../Common");
const K8sClient = require("./K8sClient");

const { resourceKey, displayName } = require("./K8sCommon");

exports.K8sDeployment = ({ spec, config }) => {
  const configDefault = async ({ name, meta, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: "apps/v1",
      kind: "Deployment",
      metadata: {
        name,
        namespace: meta.namespace,
        annotations: buildTagsObject({ name, config }),
      },
    })(properties);

  const pathGet = ({ name, namespace }) =>
    `/apis/apps/v1/namespaces/${namespace}/deployments/${name}`;
  const pathList = () => `/apis/apps/v1/deployments`;
  const pathCreate = ({ namespace }) =>
    `/apis/apps/v1/namespaces/${namespace}/deployments`;
  const pathDelete = ({ name, namespace }) =>
    `/apis/apps/v1/namespaces/${namespace}/deployments/${name}`;

  return K8sClient({
    spec,
    config,
    pathGet,
    pathList,
    pathCreate,
    pathDelete,
    configDefault,
    resourceKey,
    displayName,
  });
};
