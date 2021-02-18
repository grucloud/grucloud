const { eq, tap, pipe, get, fork, and, filter, switchCase } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const logger = require("../../logger")({ prefix: "K8sPersistentVolume" });
const { tos } = require("../../tos");
const { buildTagsObject } = require("../Common");
const K8sClient = require("./K8sClient");
const {
  displayNameDefault,
  displayNameResourceDefault,
  resourceKeyDefault,
} = require("./K8sCommon");

// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#persistentvolume-v1-core

exports.K8sPersistentVolume = ({ spec, config }) => {
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: "v1",
      kind: "PersistentVolume",
      metadata: {
        name,
        annotations: buildTagsObject({ name, config }),
      },
    })(properties);

  const baseURL = `/api/v1/persistentvolumes`;

  const pathGet = ({ name }) => `${baseURL}/${name}`;
  const pathUpdate = pathGet;
  const pathDelete = pathGet;
  const pathList = () => baseURL;
  const pathCreate = () => baseURL;
  //TODO use
  /*
const isUpByIdFactory = ({ getById }) =>
    isUpByIdCore({
      isInstanceUp,
      getById,
    });

    */
  const isUpByIdFactory = ({ getById }) => ({ live }) =>
    pipe([
      tap(() => {
        logger.debug(`pv isUpById: ${tos(live)}`);
      }),
      () => getById({ live }),
      tap((newLive) => {
        logger.debug(`pv newLive: ${tos(newLive)}`);
      }),
      eq(get("status.phase"), "Available"),
      tap((isUp) => {
        logger.debug(`pv isUp: ${isUp}`);
      }),
    ])(live);

  return K8sClient({
    spec,
    config,
    pathGet,
    pathList,
    pathCreate,
    pathUpdate,
    pathDelete,
    configDefault,
    isUpByIdFactory,
    displayName: displayNameDefault,
    displayNameResource: displayNameResourceDefault,
    resourceKey: resourceKeyDefault,
  });
};
