const { eq, tap, pipe, get, fork, and } = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const logger = require("../../logger")({ prefix: "K8sReplicaSet" });
const { tos } = require("../../tos");
const K8sClient = require("./K8sClient");

const { resourceKey, displayName } = require("./K8sCommon");

exports.K8sReplicaSet = ({ spec, config }) => {
  const pathGet = ({ name, namespace }) =>
    `/apis/apps/v1/namespaces/${namespace}/replicasets/${name}`;
  const pathGetStatus = ({ name, namespace }) =>
    `/apis/apps/v1/namespaces/${namespace}/replicasets/${name}/status`;
  const pathList = () => `/apis/apps/v1/replicasets`;

  return K8sClient({
    spec,
    config,
    pathGet,
    pathGetStatus,
    pathList,
    resourceKey,
    displayName,
  });
};
