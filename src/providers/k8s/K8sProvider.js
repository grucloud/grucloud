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
  or,
  filter,
} = require("rubico");
const { defaultsDeep, first, find, last } = require("rubico/x");
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
const { K8sUtils, toApiVersion } = require("./K8sUtils");
const {
  createResourceNamespaceless,
  createResourceNamespace,
} = require("./K8sDumpster");
const {
  isOurMinionPersistentVolumeClaim,
} = require("./K8sPersistentVolumeClaim");

const cannotBeDeletedDefault = ({ name, resources }) =>
  pipe([
    () => resources,
    not(find(eq(get("name"), name))),
    tap((result) => {
      logger.debug(`cannotBeDeletedDefault ${name}: ${result}`);
    }),
  ])();

const fnSpecs = () => [
  {
    type: "Namespace",
    Client: createResourceNamespaceless({
      baseUrl: ({ apiVersion }) => `/api/${apiVersion}/namespaces`,
      configKey: "namespace",
      apiVersion: "v1",
      kind: "Namespace",
      cannotBeDeleted: pipe([
        get("resource.metadata.name", ""),
        or([
          (name) => name.startsWith("default"),
          (name) => name.startsWith("kube"),
        ]),
      ]),
    }),
    isOurMinion,
  },
  // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#customresourcedefinition-v1beta1-apiextensions-k8s-io
  {
    type: "CustomResourceDefinition",
    Client: ({ config, spec }) =>
      createResourceNamespaceless({
        baseUrl: ({ apiVersion }) =>
          `/apis/${apiVersion}/customresourcedefinitions`,
        configKey: "customResourceDefinition",
        apiVersion: "apiextensions.k8s.io/v1",
        kind: "CustomResourceDefinition",
        cannotBeDeleted: cannotBeDeletedDefault,
        isUpByIdFactory: K8sUtils({ config }).isUpByCrd,
      })({ config, spec }),
    isOurMinion,
  },
  // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#mutatingwebhookconfiguration-v1-admissionregistration-k8s-io
  {
    type: "MutatingWebhookConfiguration",
    Client: createResourceNamespaceless({
      baseUrl: ({ apiVersion }) =>
        `/apis/${apiVersion}/mutatingwebhookconfigurations`,
      configKey: "mutatingWebhookConfiguration",
      apiVersion: "admissionregistration.k8s.io/v1",
      kind: "MutatingWebhookConfiguration",
      cannotBeDeleted: cannotBeDeletedDefault,
    }),
    isOurMinion,
  },
  //https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#validatingwebhookconfiguration-v1-admissionregistration-k8s-io
  {
    type: "ValidatingWebhookConfiguration",
    Client: createResourceNamespaceless({
      baseUrl: ({ apiVersion }) =>
        `/apis/${apiVersion}/validatingwebhookconfigurations`,
      configKey: "validatingWebhookConfiguration",
      apiVersion: "admissionregistration.k8s.io/v1",
      kind: "ValidatingWebhookConfiguration",
      cannotBeDeleted: cannotBeDeletedDefault,
    }),
    isOurMinion,
  },
  // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#clusterrole-v1-rbac-authorization-k8s-io
  {
    type: "ClusterRole",
    Client: createResourceNamespaceless({
      baseUrl: ({ apiVersion }) => `/apis/${apiVersion}/clusterroles`,
      configKey: "clusterRole",
      apiVersion: "rbac.authorization.k8s.io/v1",
      kind: "ClusterRole",
      cannotBeDeleted: cannotBeDeletedDefault,
    }),
    isOurMinion,
  },
  // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#clusterrolebinding-v1-rbac-authorization-k8s-io
  {
    type: "ClusterRoleBinding",
    dependsOn: ["ClusterRole", "ServiceAccount"],
    Client: createResourceNamespaceless({
      baseUrl: ({ apiVersion }) => `/apis/${apiVersion}/clusterrolebindings`,
      configKey: "clusterRoleBinding",
      apiVersion: "rbac.authorization.k8s.io/v1",
      kind: "ClusterRoleBinding",
      cannotBeDeleted: cannotBeDeletedDefault,
    }),
    isOurMinion,
  },
  // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#role-v1beta1-rbac-authorization-k8s-io
  {
    type: "Role",
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/apis/${apiVersion}/namespaces/${namespace}/roles`,
      pathList: ({ apiVersion }) => `/apis/${apiVersion}/roles`,
      configKey: "role",
      apiVersion: "rbac.authorization.k8s.io/v1beta1",
      kind: "Role",
      cannotBeDeleted: cannotBeDeletedDefault,
    }),
    isOurMinion,
  },
  // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#rolebinding-v1beta1-rbac-authorization-k8s-io
  {
    type: "RoleBinding",
    dependsOn: ["Namespace", "Role", "ServiceAccount"],
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/apis/${apiVersion}/namespaces/${namespace}/rolebindings`,
      pathList: ({ apiVersion }) => `/apis/${apiVersion}/rolebindings`,
      configKey: "roleBinding",
      apiVersion: "rbac.authorization.k8s.io/v1beta1",
      kind: "RoleBinding",
      cannotBeDeleted: cannotBeDeletedDefault,
    }),
    isOurMinion,
  },
  // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#serviceaccount-v1-core
  {
    type: "ServiceAccount",
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/api/${apiVersion}/namespaces/${namespace}/serviceaccounts`,
      pathList: ({ apiVersion }) => `/api/${apiVersion}/serviceaccounts`,
      configKey: "serviceAccount",
      apiVersion: "v1",
      kind: "ServiceAccount",
      cannotBeDeleted: cannotBeDeletedDefault,
    }),
    isOurMinion,
  },
  {
    type: "Secret",
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/api/${apiVersion}/namespaces/${namespace}/secrets`,
      pathList: ({ apiVersion }) => `/api/${apiVersion}/secrets`,
      configKey: "secret",
      apiVersion: "v1",
      kind: "Secret",
      cannotBeDeleted: cannotBeDeletedDefault,
    }),
    isOurMinion,
  },
  {
    type: "Ingress",
    dependsOn: ["Namespace"],
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/apis/${apiVersion}/namespaces/${namespace}/ingresses`,
      pathList: ({ apiVersion }) => `/apis/${apiVersion}/ingresses`,
      configKey: "ingress",
      apiVersion: "networking.k8s.io/v1",
      kind: "Ingress",
      cannotBeDeleted: cannotBeDeletedDefault,
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
      pathList: ({ apiVersion }) => `/api/${apiVersion}/services`,
      configKey: "service",
      apiVersion: "v1",
      kind: "Service",
      cannotBeDeleted: cannotBeDeletedDefault,
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
      pathList: ({ apiVersion }) => `/api/${apiVersion}/persistentvolumeclaims`,
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
    dependsOn: ["Namespace", "ConfigMap", "Secret"],
    Client: ({ config, spec }) =>
      createResourceNamespace({
        baseUrl: ({ namespace, apiVersion }) =>
          `/apis/${apiVersion}/namespaces/${namespace}/deployments`,
        pathList: ({ apiVersion }) => `/apis/${apiVersion}/deployments`,
        configKey: "deployment",
        apiVersion: "apps/v1",
        kind: "Deployment",
        cannotBeDeleted: cannotBeDeletedDefault,
        isUpByIdFactory: K8sUtils({ config }).isUpByPod,
      })({ config, spec }),
    isOurMinion,
    compare,
  },
  {
    type: "StatefulSet",
    dependsOn: ["Namespace", "ConfigMap", "Secret"],
    Client: ({ config, spec }) =>
      createResourceNamespace({
        baseUrl: ({ namespace, apiVersion }) =>
          `/apis/${apiVersion}/namespaces/${namespace}/statefulsets`,
        pathList: ({ apiVersion }) => `/apis/${apiVersion}/statefulsets`,
        configKey: "statefulSets",
        apiVersion: "apps/v1",
        kind: "StatefulSet",
        cannotBeDeleted: cannotBeDeletedDefault,
        isUpByIdFactory: K8sUtils({ config }).isUpByPod,
      })({ config, spec }),
    isOurMinion,
    compare,
  },
  {
    type: "ConfigMap",
    dependsOn: ["Namespace"],
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/api/${apiVersion}/namespaces/${namespace}/configmaps`,
      pathList: ({ apiVersion }) => `/api/${apiVersion}/configmaps`,
      configKey: "configMap",
      apiVersion: "v1",
      kind: "ConfigMap",
      cannotBeDeleted: cannotBeDeletedDefault,
    }),
    isOurMinion,
    compare,
  },
  {
    type: "Pod",
    dependsOn: ["Namespace", "ConfigMap", "Secret"],
    listDependsOn: ["ReplicaSet", "StatefulSet"],
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/api/${apiVersion}/namespaces/${namespace}/pods`,
      pathList: ({ apiVersion }) => `/api/${apiVersion}/pods`,
      configKey: "pod",
      apiVersion: "v1",
      kind: "Pod",
    }),
    isOurMinion,
    listOnly: true,
  },
  {
    type: "ReplicaSet",
    dependsOn: ["Namespace", "ConfigMap", "Secret"],
    Client: createResourceNamespace({
      baseUrl: ({ apiVersion, namespace }) =>
        `/apis/${apiVersion}/namespaces/${namespace}/replicasets`,
      pathList: ({ apiVersion }) => `/apis/${apiVersion}/replicasets`,
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

exports.K8sProvider = ({
  name = providerType,
  manifests = [],
  config = {},
  ...other
}) => {
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

  const manifestToSpec = (manifests = []) =>
    pipe([
      tap(() => {
        logger.info(`manifestToSpec ${manifests.length}`);
      }),
      () => manifests,
      filter(eq(get("kind"), "CustomResourceDefinition")),
      tap((xxx) => {
        logger.info("manifestToSpec ");
      }),
      map(get("spec")),
      tap((xxx) => {
        logger.info("manifestToSpec ");
      }),
      map(({ names, scope, versions, group }) =>
        switchCase([
          () => scope === "Namespaced",
          () => ({
            type: names.kind,
            dependsOn: ["CustomResourceDefinition"],
            Client: createResourceNamespace({
              baseUrl: ({ namespace, apiVersion }) =>
                `/apis/${apiVersion}/namespaces/${namespace}/${names.plural}`,
              pathList: ({ apiVersion }) =>
                `/apis/${apiVersion}/${names.plural}`,
              configKey: names.singular,
              apiVersion: toApiVersion({ group, versions }),
              kind: names.kind,
            }),
            isOurMinion,
            compare,
          }),
          () => ({
            type: names.kind,
            dependsOn: ["CustomResourceDefinition"],
            Client: createResourceNamespaceless({
              baseUrl: ({ apiVersion }) =>
                `/apis/${apiVersion}/${names.plural}`,
              configKey: names.singular,
              apiVersion: toApiVersion({ group, versions }),
              kind: names.kind,
            }),
            isOurMinion,
            compare,
          }),
        ])()
      ),
      tap((xxx) => {
        logger.info("manifestToSpec ");
      }),
    ])();
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
    fnSpecs: () => [...fnSpecs(), ...manifestToSpec(manifests)],
    start,
    info,
  });
};
