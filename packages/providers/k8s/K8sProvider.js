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
  reduce,
  pick,
} = require("rubico");
const {
  defaultsDeep,
  first,
  find,
  isFunction,
  includes,
  pluck,
  isObject,
  flatten,
  isEmpty,
  values,
  uniq,
} = require("rubico/x");
const shell = require("shelljs");
const os = require("os");
const path = require("path");
const fs = require("fs").promises;
const yaml = require("js-yaml");

const logger = require("@grucloud/core/logger")({ prefix: "K8sProvider" });
const { tos } = require("@grucloud/core/tos");
const CoreProvider = require("@grucloud/core/CoreProvider");

const { compare, isOurMinion } = require("./K8sCommon");
const { K8sUtils, toApiVersion } = require("./K8sUtils");
const {
  createResourceNamespaceless,
  createResourceNamespace,
} = require("./K8sDumpster");
const {
  isOurMinionPersistentVolumeClaim,
} = require("./K8sPersistentVolumeClaim");

const cannotBeDeletedDefault = ({ live, config }) =>
  pipe([
    () => live.metadata.annotations,
    switchCase([
      eq(get(config.managedByKey), config.managedByValue),
      () => false,
      () => true,
    ]),
    tap((result) => {
      logger.debug(`cannotBeDeletedDefault ${live.metadata.name}: ${result}`);
    }),
  ])();

const findDependenciesService = ({ live, lives, config }) =>
  pipe([
    () => live,
    get("spec.selector.matchLabels.app"),
    (label) =>
      pipe([
        () =>
          lives.getByType({
            providerName: config.providerName,
            type: "Service",
          }),
        pluck("live"),
        filter(eq(get("spec.selector.app"), label)),
        pluck("metadata"),
      ])(),
  ])();

const findNamespace = get("metadata.namespace", "default");

const findDependenciesConfig = ({ live }) =>
  pipe([
    () => live,
    get("spec.template.spec.containers"),
    pluck("env"),
    flatten,
    pluck("valueFrom"),
    pluck("configMapKeyRef"),
    filter(not(isEmpty)),
    tap((xxx) => {
      assert(true);
    }),
    pluck("name"),
    uniq,
    map((name) => ({ name, namespace: findNamespace(live) })),
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
        get("live.metadata.name", ""),
        or([
          (name) => name.startsWith("default"),
          (name) => name.startsWith("kube"),
        ]),
      ]),
    }),
    isOurMinion,
  },
  // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#job-v1-batch
  {
    type: "Job",
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/apis/${apiVersion}/namespaces/${namespace}/jobs`,
      pathList: ({ apiVersion }) => `/apis/${apiVersion}/jobs`,
      configKey: "job",
      apiVersion: "batch/v1",
      kind: "Job",
    }),
    isOurMinion,
  },
  // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#poddisruptionbudget-v1beta1-policy
  {
    type: "PodDisruptionBudget",
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/apis/${apiVersion}/namespaces/${namespace}/poddisruptionbudgets`,
      pathList: ({ apiVersion }) => `/apis/${apiVersion}/poddisruptionbudgets`,
      configKey: "podDisruptionBudget",
      apiVersion: "policy/v1beta1",
      kind: "PodDisruptionBudget",
    }),
    isOurMinion,
  },
  // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#daemonset-v1-apps
  {
    type: "DaemonSet",
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/apis/${apiVersion}/namespaces/${namespace}/daemonsets`,
      pathList: ({ apiVersion }) => `/apis/${apiVersion}/daemonsets`,
      configKey: "daemonset",
      apiVersion: "apps/v1",
      kind: "DaemonSet",
    }),
    isOurMinion,
  },
  // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#apiservice-v1-apiregistration-k8s-io
  {
    type: "APIService",
    Client: ({ config, spec }) =>
      createResourceNamespaceless({
        baseUrl: ({ apiVersion }) => `/apis/${apiVersion}/apiservices`,
        configKey: "apiService",
        apiVersion: "apiregistration.k8s.io/v1",
        kind: "APIService",
      })({ config, spec }),
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
        isInstanceUp: K8sUtils({ config }).isUpByCrd,
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
      findDependencies: ({ live, lives }) => [
        {
          type: "ClusterRole",
          ids: pipe([
            () => live,
            get("roleRef.name"),
            (name) => [{ name, namespace: findNamespace(live) }],
          ])(),
        },
        {
          type: "ServiceAccount",
          ids: pipe([
            () => live,
            get("subjects"),
            filter(eq(get("kind"), "ServiceAccount")),
            tap((xxx) => {
              assert(true);
            }),
          ])(),
        },
      ],
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
      findDependencies: ({ live }) => [
        {
          type: "Role",
          ids: pipe([
            () => live,
            get("roleRef.name"),
            (name) => [{ name, namespace: findNamespace(live) }],
          ])(),
        },
      ],
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
      findDependencies: ({ live }) => [
        {
          type: "Secret",
          ids: pipe([
            () => live,
            get("secrets"),
            map(({ name }) => ({ name, namespace: findNamespace(live) })),
          ])(),
        },
      ],
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
    dependsOn: ["Namespace", "Deployment"],
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/apis/${apiVersion}/namespaces/${namespace}/ingresses`,
      pathList: ({ apiVersion }) => `/apis/${apiVersion}/ingresses`,
      configKey: "ingress",
      apiVersion: "networking.k8s.io/v1",
      kind: "Ingress",
      cannotBeDeleted: cannotBeDeletedDefault,
      isInstanceUp: pipe([
        get("status"),
        tap((status) => {
          logger.debug(`isInstanceUp ingress status: ${tos(status)}`);
        }),
        get("loadBalancer.ingress"),
        first,
        not(isEmpty),
      ]),
      findDependencies: ({ live }) => [
        {
          type: "Service",
          ids: pipe([
            () => live,
            get("spec.rules"),
            tap((rules) => {
              logger.debug(`ingress findDependencies ${rules}`);
            }),
            map(
              pipe([
                pluck("paths"),
                flatten,
                get("backend"),
                switchCase([
                  get("service.name"),
                  pipe([
                    // for minikube
                    get("service.name"),
                    (name) => [{ name, namespace: findNamespace(live) }],
                  ]),
                  pipe([
                    // EKS
                    get("serviceName"),
                    (name) => [
                      {
                        name,
                        namespace: findNamespace(live),
                      },
                    ],
                  ]),
                ]),
              ])
            ),
            flatten,
            filter(not(isEmpty)),
            tap((results) => {
              logger.debug(`ingress findDependencies ${tos(results)}`);
            }),
          ])(),
        },
      ],
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
      isInstanceUp: (instance) =>
        includes(get("status.phase")(instance))(["Available", "Bound"]),
    }),
    isOurMinion,
    compare,
  },
  {
    type: "PersistentVolumeClaim",
    dependsOn: ["Namespace", "StorageClass", "PersistentVolume"],
    Client: ({ config, spec }) =>
      createResourceNamespace({
        baseUrl: ({ namespace, apiVersion }) =>
          `/api/${apiVersion}/namespaces/${namespace}/persistentvolumeclaims`,
        pathList: ({ apiVersion }) =>
          `/api/${apiVersion}/persistentvolumeclaims`,
        configKey: "secret",
        apiVersion: "v1",
        kind: "PersistentVolumeClaim",
        findDependencies: ({ live, lives }) => [
          {
            type: "PersistentVolume",
            ids: pipe([
              () => live,
              tap((xxx) => {
                logger.debug(``, lives);
              }),
              get("spec.volumeName"),
              (volumeName) => [{ namespace: "default", name: volumeName }],
              filter(not(isEmpty)),
              tap((xxx) => {
                assert(true);
              }),
            ])(),
          },
        ],
      })({ config, spec }),
    isOurMinion: isOurMinionPersistentVolumeClaim,
    compare,
  },
  {
    type: "Deployment",
    dependsOn: [
      "Namespace",
      "ConfigMap",
      "Secret",
      "ServiceAccount",
      "CustomResourceDefinition",
    ],
    Client: ({ config, spec }) =>
      createResourceNamespace({
        baseUrl: ({ namespace, apiVersion }) =>
          `/apis/${apiVersion}/namespaces/${namespace}/deployments`,
        pathList: ({ apiVersion }) => `/apis/${apiVersion}/deployments`,
        configKey: "deployment",
        apiVersion: "apps/v1",
        kind: "Deployment",
        cannotBeDeleted: cannotBeDeletedDefault,
        isInstanceUp: K8sUtils({ config }).isUpByPod,
        findDependencies: ({ live, lives }) => [
          {
            type: "Service",
            ids: findDependenciesService({ live, lives, config }),
          },
          {
            type: "ConfigMap",
            ids: findDependenciesConfig({ live, lives }),
          },
        ],
      })({ config, spec }),
    isOurMinion,
    compare,
  },
  {
    type: "StatefulSet",
    dependsOn: ["Namespace", "ConfigMap", "Secret", "ServiceAccount"],
    Client: ({ config, spec }) =>
      createResourceNamespace({
        baseUrl: ({ namespace, apiVersion }) =>
          `/apis/${apiVersion}/namespaces/${namespace}/statefulsets`,
        pathList: ({ apiVersion }) => `/apis/${apiVersion}/statefulsets`,
        configKey: "statefulSets",
        apiVersion: "apps/v1",
        kind: "StatefulSet",
        cannotBeDeleted: cannotBeDeletedDefault,
        isInstanceUp: K8sUtils({ config }).isUpByPod,
        findDependencies: ({ live, lives }) => [
          {
            type: "Service",
            ids: findDependenciesService({ live, lives, config }),
          },
          {
            type: "ConfigMap",
            ids: findDependenciesConfig({ live }),
          },
        ],
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
    dependsOn: [
      "Namespace",
      "ConfigMap",
      "Secret",
      "ServiceAccount",
      "ReplicaSet",
      "StatefulSet",
      "Deployment",
    ],
    Client: createResourceNamespace({
      baseUrl: ({ namespace, apiVersion }) =>
        `/api/${apiVersion}/namespaces/${namespace}/pods`,
      pathList: ({ apiVersion }) => `/api/${apiVersion}/pods`,
      configKey: "pod",
      apiVersion: "v1",
      kind: "Pod",
      findDependencies: ({ live, lives }) => [
        {
          type: "ReplicaSet",
          ids: pipe([
            () => live,
            get("metadata.ownerReferences"),
            filter(eq(get("kind"), "ReplicaSet")),
            map(({ name }) => ({ name, namespace: findNamespace(live) })),
          ])(),
        },
        {
          type: "StatefulSet",
          ids: pipe([
            tap(() => {
              logger.debug(`${lives}`);
            }),
            () => live,
            get("metadata.ownerReferences"),
            filter(eq(get("kind"), "StatefulSet")),
            map(({ name }) => ({ name, namespace: findNamespace(live) })),
          ])(),
        },
        {
          type: "ConfigMap",
          ids: pipe([
            tap(() => {
              assert(true);
            }),
            () => live,
            get("spec.volumes"),
            filter(get("configMap")),
            map(({ name }) => ({ name, namespace: findNamespace(live) })),
          ])(),
        },
        {
          type: "Secret",
          ids: pipe([
            () => live,
            get("spec.volumes"),
            filter(get("secret")),
            map(({ name }) => ({ name, namespace: findNamespace(live) })),
          ])(),
        },
        {
          type: "PersistentVolumeClaim",
          ids: pipe([
            () => live,
            get("spec.volumes"),
            filter(get("persistentVolumeClaim")),
            map(get("persistentVolumeClaim.claimName")),
            filter(not(isEmpty)),
            map((name) => ({
              name,
              namespace: findNamespace(live),
            })),
          ])(),
        },
      ],
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
      findDependencies: ({ live, lives }) => [
        {
          type: "Deployment",
          ids: pipe([
            () => live,
            get("metadata.ownerReferences"),
            map(({ name }) => ({ name, namespace: findNamespace(live) })),
          ])(),
        },
      ],
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
      //throw error;
    }
  )();

const getAuthToken = ({ kubeConfig }) =>
  pipe([
    () => kubeConfig.contexts,
    find(eq(get("name"), kubeConfig["current-context"])),
    get("context.user"),
    (user) => find(eq(get("name"), user))(kubeConfig.users),
    get("user.exec"),
    switchCase([
      isEmpty,
      () => {
        logger.error(`getAuthToken: no user in kubeConfig`);
        return undefined;
      },
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
  stage = "dev",
  config,
  configs = [],
  ...other
}) => {
  config && assert(isFunction(config), "config must be a function");

  const mergeConfig = ({ config, configs }) =>
    pipe([
      () => [...configs, config],
      filter((x) => x),
      reduce((acc, config) => defaultsDeep(config(acc))(acc), {
        stage,
        accessToken: () => accessToken,
        kubeConfig: () => {
          assert(kubeConfig, "kubeConfig not set, provider not started");
          return kubeConfig;
        },
      }),
      tap((merged) => {
        logger.info(`mergeConfig : ${tos(merged)}`);
      }),
    ])();

  let mergedConfig = mergeConfig({ config, configs });

  const info = () => mergedConfig;

  let accessToken;
  let kubeConfig;

  const start = pipe([
    tap(() => {
      logger.info("start k8s");
    }),
    () =>
      readKubeConfig({
        kubeConfigFile: mergedConfig.kubeConfigFile,
      }),
    switchCase([
      isEmpty,
      () => {},
      pipe([
        tap((newKubeConfig) => {
          kubeConfig = newKubeConfig;
        }),
        (kubeConfig) => getAuthToken({ kubeConfig }),
        (token) => {
          logger.info(`start set accessToken to ${token}`);
          accessToken = token;
        },
      ]),
    ]),
  ]);

  const manifestToSpec = (manifests = []) =>
    pipe([
      tap(() => {
        logger.info(`manifestToSpec ${manifests.length}`);
      }),
      () => manifests,
      filter(eq(get("kind"), "CustomResourceDefinition")),
      map(get("spec")),
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
    get config() {
      return mergedConfig;
    },
    fnSpecs: () => [...fnSpecs(), ...manifestToSpec(manifests)],
    start,
    info,
  });
};
