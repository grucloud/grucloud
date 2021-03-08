const { eq, tap, pipe, get, fork, and, or } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

const { buildTagsObject } = require("../Common");
const K8sClient = require("./K8sClient");

// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#clusterrole-v1beta1-rbac-authorization-k8s-io
const baseUrl = `/apis/rbac.authorization.k8s.io/v1/clusterroles`;

exports.K8sClusterRole = ({ spec, config }) => {
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: "rbac.authorization.k8s.io/v1",
      kind: "ClusterRole",
      metadata: {
        name,
        annotations: buildTagsObject({ name, config }),
      },
    })(properties);

  const pathGet = ({ name }) => `${baseUrl}/${name}`;
  const pathList = () => baseUrl;
  const pathCreate = pathList;
  const pathUpdate = pathGet;
  const pathDelete = pathGet;

  //const cannotBeDeleted = eq(get("name"), "default");

  return K8sClient({
    spec,
    config,
    pathGet,
    pathList,
    pathCreate,
    pathUpdate,
    pathDelete,
    configDefault,
    //cannotBeDeleted,
  });
};
