const assert = require("assert");
const {
  pipe,
  get,
  tap,
  eq,
  switchCase,
  assign,
  or,
  pick,
  and,
  not,
} = require("rubico");
const { find, first, isEmpty } = require("rubico/x");

const logger = require("../../logger")({ prefix: "K8sPersistentVolumeClaim" });
const { tos } = require("../../tos");
const { buildTagsObject } = require("../Common");
const K8sClient = require("./K8sClient");
const { getNamespace } = require("./K8sCommon");
const { isOurMinionObject } = require("../Common");

// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#persistentvolumeclaim-v1-core

exports.isOurMinionPersistentVolumeClaim = ({ resource, lives, config }) =>
  or([
    () => isOurMinionObject({ tags: resource.metadata.annotations, config }),
    pipe([
      () => get("spec.volumeName")(resource),
      (volumeName) =>
        pipe([
          () => lives,
          find(eq(get("type"), "PersistentVolume")),
          get("resources"),
          find(eq(get("name"), volumeName)),
          get("managedByUs"),
          tap((managedByUs) => {
            logger.info(
              `isOurMinionPersistentVolumeClaim ${volumeName}: ${managedByUs}`
            );
          }),
        ])(),
    ]),
  ])();
