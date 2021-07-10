const assert = require("assert");
const { pipe, get, tap, eq, or } = require("rubico");
const { find, first, isEmpty } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "K8sPersistentVolumeClaim",
});
const { tos } = require("@grucloud/core/tos");
const { isOurMinionObject } = require("@grucloud/core/Common");

// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#persistentvolumeclaim-v1-core

exports.isOurMinionPersistentVolumeClaim = ({ live, lives, config }) =>
  or([
    () => isOurMinionObject({ tags: live.metadata.annotations, config }),
    pipe([
      () => get("spec.volumeName")(live),
      (volumeName) =>
        pipe([
          () =>
            lives.getByType({
              type: "PersistentVolume",
              providerName: config.providerName,
            }),
          find(eq(get("name"), volumeName)),
          get("managedByUs"),
          tap((managedByUs) => {
            logger.info(
              `isOurMinionPersistentVolumeClaim ${live.metadata.name}, volumeName: ${volumeName}: ${managedByUs}`
            );
          }),
        ])(),
    ]),
  ])();
