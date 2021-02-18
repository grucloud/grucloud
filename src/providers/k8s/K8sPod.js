const assert = require("assert");
const logger = require("../../logger")({ prefix: "K8sPod" });
const { tos } = require("../../tos");
const K8sClient = require("./K8sClient");
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
  or,
  omit,
  assign,
  not,
} = require("rubico");

const { first, find } = require("rubico/x");

const { isOurMinionObject } = require("../Common");

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

exports.isOurMinionPod = ({ resource, lives, config }) =>
  or([
    () => isOurMinionObject({ tags: resource.tags, config }),
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`isOurMinionPod ${JSON.stringify({ resource })}`);
      }),
      () => first(resource.metadata.ownerReferences),
      switchCase([
        not(isEmpty),
        ({ kind, uid }) =>
          pipe([
            find(eq(get("type"), kind)),
            get("resources"),
            find(eq(get("live.metadata.uid"), uid)),
            get("managedByUs"),
            tap((result) => {
              logger.info(`isOurMinionPod ${resource.toString()}: ${result}`);
            }),
          ])(lives),
        () => false,
      ]),
    ]),
  ])();
