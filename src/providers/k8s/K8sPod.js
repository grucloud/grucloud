const logger = require("../../logger")({ prefix: "K8sPod" });
const { tos } = require("../../tos");
const K8sClient = require("./K8sClient");

const { getNamespace } = require("./K8sCommon");

exports.K8sPod = ({ spec, config }) => {
  // TODO may not need it
  const pathGet = ({ name, namespace }) =>
    `/api/v1/namespaces/${namespace}/pods/${name}`;
  const pathGetStatus = ({ name, namespace }) =>
    `/api/v1/namespaces/${namespace}/pods/${name}/status`;
  const pathList = () => `/api/v1/pods`;

  return K8sClient({
    spec,
    config,
    pathGet,
    pathGetStatus,
    pathList,
  });
};
