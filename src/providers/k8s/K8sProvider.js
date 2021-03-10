const assert = require("assert");
const {
  map,
  pipe,
  get,
  tap,
  tryCatch,
  switchCase,
  eq,
  not,
} = require("rubico");
const { defaultsDeep, first, find } = require("rubico/x");
const shell = require("shelljs");
const os = require("os");
const path = require("path");
const fs = require("fs").promises;
const yaml = require("js-yaml");

const logger = require("../../logger")({ prefix: "K8sProvider" });
const { tos } = require("../../tos");
const CoreProvider = require("../CoreProvider");
const { compare, isOurMinion } = require("./K8sCommon");
const { createResourceNamespaceless } = require("./K8sDumpster");
const { K8sReplicaSet } = require("./K8sReplicaSet");
const { K8sService } = require("./K8sService");
const { K8sStorageClass } = require("./K8sStorageClass");
const { K8sPersistentVolume } = require("./K8sPersistentVolume");
const {
  K8sPersistentVolumeClaim,
  isOurMinionPersistentVolumeClaim,
} = require("./K8sPersistentVolumeClaim");
const { K8sPod } = require("./K8sPod");
const { K8sNamespace } = require("./K8sNamespace");
const { K8sDeployment } = require("./K8sDeployment");
const { K8sConfigMap } = require("./K8sConfigMap");
const { K8sIngress } = require("./K8sIngress");
const { K8sStatefulSet } = require("./K8sStatefulSet");
const { K8sServiceAccount } = require("./K8sServiceAccount");
const { K8sSecret } = require("./K8sSecret");

const fnSpecs = () => [
  {
    type: "Namespace",
    Client: K8sNamespace,
    isOurMinion,
  },
  {
    type: "ClusterRole",
    Client: createResourceNamespaceless({
      baseUrl: "/apis/rbac.authorization.k8s.io/v1/clusterroles",
      configKey: "clusterRole",
      apiVersion: "rbac.authorization.k8s.io/v1",
      kind: "ClusterRole",
      cannotBeDeleted: ({ name, resources }) =>
        pipe([() => resources, not(find(eq(get("name"), name)))])(),
    }),
    isOurMinion,
  },
  {
    type: "ServiceAccount",
    Client: K8sServiceAccount,
    isOurMinion,
  },
  {
    type: "Secret",
    Client: K8sSecret,
    isOurMinion,
  },
  {
    type: "Ingress",
    dependsOn: ["Namespace", "Service"],
    Client: K8sIngress,
    isOurMinion,
    compare,
  },
  {
    type: "StorageClass",
    Client: K8sStorageClass,
    isOurMinion,
    compare,
  },
  {
    type: "Service",
    dependsOn: ["Namespace"],
    Client: K8sService,
    isOurMinion,
    compare,
  },
  {
    type: "PersistentVolume",
    Client: K8sPersistentVolume,
    dependsOn: ["Namespace", "StorageClass"],
    isOurMinion,
    compare,
  },
  {
    type: "PersistentVolumeClaim",
    Client: K8sPersistentVolumeClaim,
    dependsOn: ["Namespace", "StorageClass", "PersistentVolume"],
    listDependsOn: ["PersistentVolume"],
    isOurMinion: isOurMinionPersistentVolumeClaim,
    compare,
  },
  {
    type: "Deployment",
    dependsOn: ["Namespace", "ConfigMap"],
    Client: K8sDeployment,
    isOurMinion,
    compare,
  },
  {
    type: "StatefulSet",
    dependsOn: ["Namespace", "ConfigMap"],
    Client: K8sStatefulSet,
    isOurMinion,
    compare,
  },
  {
    type: "ConfigMap",
    dependsOn: ["Namespace"],
    Client: K8sConfigMap,
    isOurMinion,
    compare,
  },
  {
    type: "Pod",
    dependsOn: ["Namespace", "ConfigMap"],
    listDependsOn: ["ReplicaSet", "StatefulSet"],
    Client: K8sPod,
    isOurMinion,
    listOnly: true,
  },
  {
    type: "ReplicaSet",
    dependsOn: ["Namespace", "ConfigMap"],
    Client: K8sReplicaSet,
    isOurMinion,
    listOnly: true,
  },
];

const readKubeConfig = ({
  kubeConfigFile = path.resolve(os.homedir(), ".kube/config"),
}) =>
  tryCatch(
    pipe([
      () => fs.readFile(kubeConfigFile, "utf-8"),
      yaml.load,
      tap((kubeConfig) => {
        logger.info(tos(kubeConfig));
      }),
    ]),
    (error) => {
      logger.error(
        `Cannot read kube config file: ${kubeConfigFile}, error: ${error}`
      );
      throw error;
    }
  )();

const getAuthToken = ({ kubeConfig }) =>
  pipe([
    get("users"),
    first,
    get("user.exec"),
    switchCase([
      isEmpty,
      () => undefined,
      pipe([
        ({ command, args }) => {
          logger.debug(`getAuthToken: ${command}, args: ${args}`);
          const fullCommand = `${command} ${args.join(" ")}`;
          const { stdout, stderr, code } = shell.exec(fullCommand, {
            silent: true,
          });
          if (code !== 0) {
            throw {
              message: `command '${fullCommand}' failed`,
              stdout,
              stderr,
              code,
            };
          }
          return stdout;
        },
        JSON.parse,
        get("status.token"),
      ]),
    ]),
  ])(kubeConfig);

const providerType = "k8s";

exports.K8sProvider = ({ name = providerType, config = {}, ...other }) => {
  const info = () => ({});

  let accessToken;
  let kubeConfig;

  const start = pipe([
    tap(() => {
      logger.info("start ");
    }),
    () => readKubeConfig({ kubeConfigFile: config.kubeConfigFile }),
    tap((newKubeConfig) => {
      kubeConfig = newKubeConfig;
    }),
    (kubeConfig) => getAuthToken({ kubeConfig }),
    (token) => {
      logger.info(`start set accessToken to ${token}`);
      accessToken = token;
    },
  ]);

  return CoreProvider({
    ...other,
    type: providerType,
    name,
    config: defaultsDeep({
      accessToken: () => accessToken,
      kubeConfig: () => {
        assert(kubeConfig, "kubeConfig not set, provider not started");
        return kubeConfig;
      },
    })(config),
    fnSpecs,
    start,
    info,
  });
};
