const assert = require("assert");

const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  pick,
  filter,
  eq,
} = require("rubico");
const {
  first,
  defaultsDeep,
  isEmpty,
  forEach,
  pluck,
  flatten,
} = require("rubico/x");

const logger = require("../../logger")({ prefix: "K8sDeployment" });
const { tos } = require("../../tos");

const K8sClient = require("./K8sClient");

exports.K8sDeployment = ({ spec, config }) => {
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: "apps/v1",
      kind: "Deployment",
      metadata: {
        name,
      },
    })(properties);

  assert(config.kubeConfig);

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
  });
};
