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
const { isUpByIdCore } = require("../Common");

const {
  createResourceNamespaceless,
  createResourceNamespace,
} = require("./K8sDumpster");
const {
  isOurMinionPersistentVolumeClaim,
} = require("./K8sPersistentVolumeClaim");
const { K8sDeployment } = require("./K8sDeployment");

const fnSpecs = () => [
  {
    type: "Namespace",
    Client: createResourceNamespaceless({
      baseUrl: ({ apiVersion }) => `/api/${apiVersion}/namespaces`,
      configKey: "namespace",
      apiVersion: "v1",
      kind: "Namespace",
      cannotBeDeleted: eq(get("name"), "default"),
    }),
    isOurMinion,
  },
  // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#customresourcedefinition-v1beta1-apiextensions-k8s-io
  {
    type: "CustomResourceDefinition",
    Client: createResourceNamespaceless({
      baseUrl: ({ apiVersion }) =>
        `/apis/${apiVersion}/customresourcedefinitions`,
      configKey: "customResourceDefinition",
      apiVersion: "apiextensions.k8s.io/v1beta1",
      kind: "CustomResourceDefinition",
      cannotBeDeleted: ({ name, resources }) =>
        pipe([() => resources, not(find(eq(get("name"), name)))])(),
    }),
    isOurMinion,
  },
  // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#mutatingwebhookconfiguration-v1-admissionregistration-k8s-io
  {
    type: "MutatingWebhookConfiguration",
    Client: createResourceNamespaceless({
      baseUrl: ({ apiVersion }) =>
        `/apis/${apiVersion}/mutatingwebhookconfigurations`,
      configKey: "mutatingWebhookConfiguration",
      apiVersion: "admissionregistration.k8s.io/v1beta1",
      kind: "MutatingWebhookConfiguration",
      cannotBeDeleted: ({ name, resources }) =>
        pipe([() => resources, not(find(eq(get("name"), name)))])(),
    }),
    isOurMinion,
  },
  {
    type: "ClusterRole",
    Client: createResourceNamespaceless({
      baseUrl: ({ apiVersion }) => `/apis/${apiVersion}/clusterroles`,
      configKey: "clusterRole",
      apiVersion: "rbac.authorization.k8s.io/v1",
      kind: "ClusterRole",
      cannotBeDeleted: ({ name, resources }) =>
        pipe([() => resources, not(find(eq(get("name"), name)))])(),
    }),
    isOurMinion,
  },
  // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#rolebinding-v1-rbac-authorization-k8s-io
  {
    type: "ClusterRoleBinding",
    Client: createResourceNamespaceless({
      baseUrl: ({ apiVersion }) => `/apis/${apiVersion}/clusterrolebindings`,
      configKey: "clusterRoleBinding",
      apiVersion: "rbac.authorization.k8s.io/v1",
      kind: "ClusterRoleBinding",
      cannotBeDeleted: ({ name, resources }) =>
        pipe([() => resources, not(find(eq(get("name"), name)))])(),
    }),
    isOurMinion,
  },
  {
    type: "ServiceAccount",
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/api/${apiVersion}/namespaces/${namespace}/serviceaccounts`,
      pathList: () => "/api/v1/serviceaccounts",
      configKey: "serviceAccount",
      apiVersion: "v1",
      kind: "ServiceAccount",
      cannotBeDeleted: ({ name }) => name.startsWith("default"),
    }),
    isOurMinion,
  },
  {
    type: "Secret",
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/api/${apiVersion}/namespaces/${namespace}/secrets`,
      pathList: () => "/api/v1/secrets",
      configKey: "secret",
      apiVersion: "v1",
      kind: "Secret",
      cannotBeDeleted: ({ name }) => name.startsWith("default"),
    }),
    isOurMinion,
  },
  {
    type: "Ingress",
    dependsOn: ["Namespace", "Service"],
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/apis/${apiVersion}/namespaces/${namespace}/ingresses`,
      pathList: ({ apiVersion }) => `/apis/${apiVersion}/ingresses`,
      configKey: "ingress",
      apiVersion: "networking.k8s.io/v1",
      kind: "Ingress",
      isUpByIdFactory: ({ getById }) =>
        isUpByIdCore({
          isInstanceUp: pipe([
            get("status.loadBalancer.ingress"),
            first,
            get("ip"),
          ]),
          getById,
        }),
    }),
    isOurMinion,
    compare,
  },
  {
    type: "StorageClass",
    Client: createResourceNamespaceless({
      baseUrl: ({ apiVersion }) => `/apis/${apiVersion}/storageclasses`,
      configKey: "storageClass",
      apiVersion: "storage.k8s.io/v1",
      kind: "StorageClass",
    }),
    isOurMinion,
    compare,
  },
  {
    type: "Service",
    dependsOn: ["Namespace"],
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/api/${apiVersion}/namespaces/${namespace}/services`,
      pathList: () => "/api/v1/services",
      configKey: "service",
      apiVersion: "v1",
      kind: "Service",
    }),
    isOurMinion,
    compare,
  },
  {
    type: "PersistentVolume",
    dependsOn: ["Namespace", "StorageClass"],
    Client: createResourceNamespaceless({
      baseUrl: ({ apiVersion }) => `/api/${apiVersion}/persistentvolumes`,
      configKey: "persistentVolume",
      apiVersion: "v1",
      kind: "PersistentVolume",
      isUpByIdFactory: ({ getById }) =>
        isUpByIdCore({
          isInstanceUp: eq(get("status.phase"), "Available"),
          getById,
        }),
    }),
    isOurMinion,
    compare,
  },
  {
    type: "PersistentVolumeClaim",
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/api/${apiVersion}/namespaces/${namespace}/persistentvolumeclaims`,
      pathList: () => "/api/v1/persistentvolumeclaims",
      configKey: "secret",
      apiVersion: "v1",
      kind: "PersistentVolumeClaim",
    }),
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
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/apis/${apiVersion}/namespaces/${namespace}/statefulsets`,
      pathList: () => "/apis/apps/v1/statefulsets",
      configKey: "statefulSets",
      apiVersion: "apps/v1",
      kind: "StatefulSet",
    }),
    isOurMinion,
    compare,
  },
  {
    type: "ConfigMap",
    dependsOn: ["Namespace"],
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/api/${apiVersion}/namespaces/${namespace}/configmaps`,
      pathList: () => "/api/v1/configmaps",
      configKey: "configMap",
      apiVersion: "v1",
      kind: "ConfigMap",
      //TODO only delete our own
      cannotBeDeleted: ({ name }) => name.startsWith("default"),
    }),
    isOurMinion,
    compare,
  },
  {
    type: "Pod",
    dependsOn: ["Namespace", "ConfigMap"],
    listDependsOn: ["ReplicaSet", "StatefulSet"],
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/api/${apiVersion}/namespaces/${namespace}/pods`,
      pathList: () => "/api/v1/pods",
      configKey: "pod",
      apiVersion: "v1",
      kind: "Pod",
    }),
    isOurMinion,
    listOnly: true,
  },
  {
    type: "ReplicaSet",
    dependsOn: ["Namespace", "ConfigMap"],
    Client: createResourceNamespace({
      baseUrl: ({ apiVersion, namespace }) =>
        `/apis/${apiVersion}/namespaces/${namespace}/replicasets`,
      pathList: () => "/apis/apps/v1/replicasets",
      configKey: "replicaSet",
      apiVersion: "apps/v1",
      kind: "ReplicaSet",
    }),
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
