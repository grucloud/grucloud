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
  set,
  omit,
  assign,
} = require("rubico");
const {
  defaultsDeep,
  first,
  isFunction,
  includes,
  pluck,
  flatten,
  isEmpty,
  identity,
  uniq,
  when,
} = require("rubico/x");
const os = require("os");
const path = require("path");
const fs = require("fs").promises;
const yaml = require("js-yaml");

const logger = require("@grucloud/core/logger")({ prefix: "K8sProvider" });
const { tos } = require("@grucloud/core/tos");
const CoreProvider = require("@grucloud/core/CoreProvider");
const { compare, omitIfEmpty } = require("@grucloud/core/Common");
const { shellRun } = require("@grucloud/core/utils/shellRun");

const {
  compareK8s,
  isOurMinion,
  findUser,
  inferNameNamespace,
  inferNameNamespaceLess,
} = require("./K8sCommon");
const { K8sUtils, toApiVersion } = require("./K8sUtils");
const {
  createResourceNamespaceless,
  createResourceNamespace,
} = require("./K8sDumpster");
const {
  isOurMinionPersistentVolumeClaim,
} = require("./K8sPersistentVolumeClaim");

const cannotBeDeletedDefault =
  ({ config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(config);
        assert(live);
      }),
      () => live,
      get("metadata.annotations"),
      switchCase([
        eq(get(config.managedByKey), config.managedByValue),
        () => false,
        () => true,
      ]),
      tap((result) => {
        //logger.debug(`cannotBeDeletedDefault ${live.metadata.name}: ${result}`);
      }),
    ])();

const findDependenciesService = ({ live, lives, config }) =>
  pipe([
    () => live,
    get("spec.selector.matchLabels.app"),
    (label) =>
      pipe([
        lives.getByType({
          providerName: config.providerName,
          type: "Service",
        }),
        pluck("live"),
        filter(eq(get("spec.selector.app"), label)),
        pluck("metadata"),
      ])(),
  ])();

const findNamespace = get("metadata.namespace", "");

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

const resourceKey = pipe([
  tap((resource) => {
    assert(resource.providerName);
    assert(resource.type);
    assert(resource.name);
  }),
  ({ providerName, type, properties, name, id }) =>
    `${providerName}${type}::${name || id}`,
  tap((params) => {
    assert(true);
  }),
]);

const fnSpecs = pipe([
  () => [
    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#apiservice-v1-apiregistration-k8s-io
    {
      type: "APIService",
      inferName: inferNameNamespaceLess,
      Client: ({ config, spec }) =>
        createResourceNamespaceless({
          baseUrl: ({ apiVersion }) => `/apis/${apiVersion}/apiservices`,
          configKey: "apiService",
          apiVersion: "apiregistration.k8s.io/v1",
          kind: "APIService",
        })({ config, spec }),
    },
    {
      type: "ConfigMap",
      dependsOn: ["Namespace"],
      dependencies: {
        namespace: {
          type: "Namespace",
        },
      },
      inferName: inferNameNamespace,
      Client: createResourceNamespace({
        baseUrl: ({ namespace, apiVersion }) =>
          `/api/${apiVersion}/namespaces/${namespace}/configmaps`,
        pathList: ({ apiVersion }) => `/api/${apiVersion}/configmaps`,
        configKey: "configMap",
        apiVersion: "v1",
        kind: "ConfigMap",
        cannotBeDeleted: cannotBeDeletedDefault,
      }),
    },
    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#clusterrole-v1-rbac-authorization-k8s-io
    {
      type: "ClusterRole",
      inferName: inferNameNamespaceLess,
      Client: createResourceNamespaceless({
        baseUrl: ({ apiVersion }) => `/apis/${apiVersion}/clusterroles`,
        configKey: "clusterRole",
        apiVersion: "rbac.authorization.k8s.io/v1",
        kind: "ClusterRole",
        cannotBeDeleted: cannotBeDeletedDefault,
      }),
    },
    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#clusterrolebinding-v1-rbac-authorization-k8s-io
    {
      type: "ClusterRoleBinding",
      dependsOn: ["ClusterRole", "ServiceAccount"],
      dependencies: {
        clusterRole: {
          type: "ClusterRole",
        },
        serviceAccount: {
          type: "ServiceAccount",
        },
      },
      inferName: inferNameNamespaceLess,
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
    },

    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#customresourcedefinition-v1beta1-apiextensions-k8s-io
    {
      type: "CustomResourceDefinition",
      inferName: inferNameNamespaceLess,
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
    },
    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#daemonset-v1-apps
    {
      type: "DaemonSet",
      dependsOn: ["Namespace"],
      dependencies: {
        namespace: {
          type: "Namespace",
        },
      },
      inferName: inferNameNamespace,
      Client: createResourceNamespace({
        baseUrl: ({ namespace, apiVersion }) =>
          `/apis/${apiVersion}/namespaces/${namespace}/daemonsets`,
        pathList: ({ apiVersion }) => `/apis/${apiVersion}/daemonsets`,
        configKey: "daemonset",
        apiVersion: "apps/v1",
        kind: "DaemonSet",
      }),
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
      dependencies: {
        namespace: {
          type: "Namespace",
        },
        customResourceDefinition: {
          type: "CustomResourceDefinition",
        },
        configMap: {
          type: "ConfigMap",
        },
        secret: {
          type: "Secret",
        },
        serviceAccount: {
          type: "ServiceAccount",
        },
      },
      inferName: inferNameNamespace,
      propertiesDefault: {
        spec: {
          template: {
            spec: {
              restartPolicy: "Always",
              terminationGracePeriodSeconds: 30,
              dnsPolicy: "ClusterFirst",
              securityContext: {},
              schedulerName: "default-scheduler",
            },
          },
          strategy: {
            type: "RollingUpdate",
            rollingUpdate: {
              maxUnavailable: "25%",
              maxSurge: "25%",
            },
          },
          revisionHistoryLimit: 10,
          progressDeadlineSeconds: 600,
        },
      },
      omitProperties: [
        ["metadata", "annotations", "deployment.kubernetes.io/revision"],
        "spec.template.metadata.creationTimestamp",
        "spec.template.spec.serviceAccount",
      ],
      compare: compareK8s({
        filterTarget: () =>
          pipe([
            assign({
              spec: pipe([
                get("spec"),
                assign({
                  template: pipe([
                    get("template"),
                    assign({
                      spec: pipe([
                        get("spec"),
                        when(
                          get("volumes"),
                          assign({
                            volumes: pipe([
                              get("volumes"),
                              map(
                                pipe([
                                  when(
                                    get("configMap"),
                                    defaultsDeep({
                                      configMap: { defaultMode: 420 },
                                    })
                                  ),
                                  when(
                                    get("secret"),
                                    defaultsDeep({
                                      secret: { defaultMode: 420 },
                                    })
                                  ),
                                ])
                              ),
                            ]),
                          })
                        ),
                        assign({
                          containers: pipe([
                            get("containers"),
                            map(
                              pipe([
                                omitIfEmpty(["env"]),
                                when(
                                  get("volumeMounts"),
                                  assign({
                                    volumeMounts: pipe([
                                      get("volumeMounts"),
                                      map(
                                        when(
                                          eq(get("readOnly"), false),
                                          omit(["readOnly"])
                                        )
                                      ),
                                    ]),
                                  })
                                ),
                                when(
                                  get("ports"),
                                  assign({
                                    ports: pipe([
                                      get("ports"),
                                      map(defaultsDeep({ protocol: "TCP" })),
                                    ]),
                                  })
                                ),
                                defaultsDeep({
                                  imagePullPolicy: "IfNotPresent",
                                  resources: {},
                                  terminationMessagePath:
                                    "/dev/termination-log",
                                  terminationMessagePolicy: "File",
                                }),
                              ])
                            ),
                          ]),
                        }),
                      ]),
                    }),
                  ]),
                }),
              ]),
            }),
          ]),
      }),
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
    },
    {
      type: "Ingress",
      dependsOn: ["Namespace", "Deployment"],
      dependencies: {
        namespace: {
          type: "Namespace",
        },
        deployment: {
          type: "Deployment",
        },
      },
      inferName: inferNameNamespace,
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
    },
    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#job-v1-batch
    {
      type: "Job",
      dependsOn: ["Namespace"],
      dependencies: {
        namespace: {
          type: "Namespace",
        },
      },
      inferName: inferNameNamespace,
      Client: createResourceNamespace({
        baseUrl: ({ namespace, apiVersion }) =>
          `/apis/${apiVersion}/namespaces/${namespace}/jobs`,
        pathList: ({ apiVersion }) => `/apis/${apiVersion}/jobs`,
        configKey: "job",
        apiVersion: "batch/v1",
        kind: "Job",
      }),
    },
    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#mutatingwebhookconfiguration-v1-admissionregistration-k8s-io
    {
      type: "MutatingWebhookConfiguration",
      inferName: inferNameNamespaceLess,
      Client: createResourceNamespaceless({
        baseUrl: ({ apiVersion }) =>
          `/apis/${apiVersion}/mutatingwebhookconfigurations`,
        configKey: "mutatingWebhookConfiguration",
        apiVersion: "admissionregistration.k8s.io/v1",
        kind: "MutatingWebhookConfiguration",
        cannotBeDeleted: cannotBeDeletedDefault,
      }),
    },
    {
      type: "Namespace",
      inferName: inferNameNamespaceLess,
      Client: createResourceNamespaceless({
        baseUrl: ({ apiVersion }) => `/api/${apiVersion}/namespaces`,
        configKey: "namespace",
        apiVersion: "v1",
        kind: "Namespace",
        cannotBeDeleted: () =>
          pipe([
            get("metadata.name", ""),
            or([
              (name) => name.startsWith("default"),
              (name) => name.startsWith("kube"),
            ]),
          ]),
      }),
      //TODO use compareK8s
      compare: compare({
        filterTarget: () => pipe([omit(["apiVersion", "kind"])]),
        filterLive: () =>
          pipe([
            omit([
              "spec",
              "metadata.uid",
              "metadata.resourceVersion",
              "metadata.creationTimestamp",
              "metadata.labels",
              "status",
            ]),
          ]),
      }),
    },
    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.25/#networkpolicy-v1-networking-k8s-io
    {
      type: "NetworkPolicy",
      dependsOn: ["Namespace"],
      dependencies: {
        namespace: {
          type: "Namespace",
        },
      },
      inferName: inferNameNamespace,
      Client: createResourceNamespace({
        baseUrl: ({ namespace, apiVersion }) =>
          `/apis/${apiVersion}/namespaces/${namespace}/networkpolicies`,
        pathList: ({ apiVersion }) => `/apis/${apiVersion}/networkpolicies`,
        configKey: "networkpolicy",
        apiVersion: "networking.k8s.io/v1",
        kind: "NetworkPolicy",
      }),
    },
    {
      type: "PersistentVolume",
      dependsOn: ["StorageClass"],
      dependencies: {
        storageClass: {
          type: "StorageClass",
        },
      },
      inferName: inferNameNamespaceLess,
      Client: createResourceNamespaceless({
        baseUrl: ({ apiVersion }) => `/api/${apiVersion}/persistentvolumes`,
        configKey: "persistentVolume",
        apiVersion: "v1",
        kind: "PersistentVolume",
        isInstanceUp: (instance) =>
          includes(get("status.phase")(instance))(["Available", "Bound"]),
      }),
    },
    {
      type: "PersistentVolumeClaim",
      dependsOn: ["Namespace", "StorageClass", "PersistentVolume"],
      dependencies: {
        namespace: {
          type: "Namespace",
        },
        storageClass: {
          type: "StorageClass",
        },
        persistentVolume: {
          type: "PersistentVolume",
        },
      },
      inferName: inferNameNamespace,
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
      dependencies: {
        namespace: {
          type: "Namespace",
        },
        configMap: {
          type: "ConfigMap",
        },
        deployment: {
          type: "Deployment",
        },
        replicaSet: {
          type: "ReplicaSet",
        },
        secret: {
          type: "Secret",
        },
        serviceAccount: {
          type: "ServiceAccount",
        },
        statefulSet: {
          type: "StatefulSet",
        },
      },
      inferName: inferNameNamespace,
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
    },
    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#poddisruptionbudget-v1beta1-policy
    {
      type: "PodDisruptionBudget",
      dependsOn: ["Namespace"],
      dependencies: {
        namespace: {
          type: "Namespace",
        },
      },
      inferName: inferNameNamespace,
      Client: createResourceNamespace({
        baseUrl: ({ namespace, apiVersion }) =>
          `/apis/${apiVersion}/namespaces/${namespace}/poddisruptionbudgets`,
        pathList: ({ apiVersion }) =>
          `/apis/${apiVersion}/poddisruptionbudgets`,
        configKey: "podDisruptionBudget",
        apiVersion: "policy/v1",
        kind: "PodDisruptionBudget",
      }),
    },

    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#role-v1beta1-rbac-authorization-k8s-io
    {
      type: "Role",
      dependsOn: ["Namespace"],
      dependencies: {
        namespace: {
          type: "Namespace",
        },
      },
      inferName: inferNameNamespace,
      Client: createResourceNamespace({
        baseUrl: ({ namespace, apiVersion }) =>
          `/apis/${apiVersion}/namespaces/${namespace}/roles`,
        pathList: ({ apiVersion }) => `/apis/${apiVersion}/roles`,
        configKey: "role",
        apiVersion: "rbac.authorization.k8s.io/v1",
        kind: "Role",
        cannotBeDeleted: cannotBeDeletedDefault,
      }),
    },
    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#rolebinding-v1beta1-rbac-authorization-k8s-io
    {
      type: "RoleBinding",
      dependsOn: ["Namespace", "Role", "ServiceAccount"],
      dependencies: {
        namespace: {
          type: "Namespace",
        },
        role: {
          type: "Role",
        },
        serviceAccount: {
          type: "ServiceAccount",
        },
      },
      inferName: inferNameNamespace,
      Client: createResourceNamespace({
        baseUrl: ({ namespace, apiVersion }) =>
          `/apis/${apiVersion}/namespaces/${namespace}/rolebindings`,
        pathList: ({ apiVersion }) => `/apis/${apiVersion}/rolebindings`,
        configKey: "roleBinding",
        apiVersion: "rbac.authorization.k8s.io/v1",
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
    },
    {
      type: "Secret",
      dependsOn: ["Namespace"],
      dependencies: {
        namespace: {
          type: "Namespace",
        },
      },
      inferName: inferNameNamespace,
      Client: createResourceNamespace({
        baseUrl: ({ namespace, apiVersion }) =>
          `/api/${apiVersion}/namespaces/${namespace}/secrets`,
        pathList: ({ apiVersion }) => `/api/${apiVersion}/secrets`,
        configKey: "secret",
        apiVersion: "v1",
        kind: "Secret",
        cannotBeDeleted: cannotBeDeletedDefault,
      }),
      compare: compareK8s({
        filterAll:
          () =>
          ({ live, target }) =>
            pipe([
              () => ({ live, target }),
              set(
                "live.data",
                pipe([
                  () => live,
                  get("data", {}),
                  map.entries(([key, value]) => [
                    key,
                    pipe([
                      () => target,
                      get("data", {}),
                      // Cannnot use rubico 'get' because the key may contain a dot
                      (data) => data[key],
                      switchCase([isEmpty, identity, () => value]),
                    ])(),
                  ]),
                ])()
              ),
              omitIfEmpty(["live.data", "target.data"]),
            ])(),
      }),
    },
    {
      type: "Service",
      dependsOn: ["Namespace"],
      dependencies: {
        namespace: {
          type: "Namespace",
        },
      },
      compare: compareK8s({
        filterAll: () => pipe([omit(["spec.clusterIP", "spec.type"])]),
      }),
      omitProperties: ["spec.clusterIPs", "spec.externalTrafficPolicy"],
      propertiesDefault: {
        spec: {
          sessionAffinity: "None",
          ipFamilies: ["IPv4"],
          ipFamilyPolicy: "SingleStack",
          internalTrafficPolicy: "Cluster",
        },
      },
      inferName: inferNameNamespace,
      Client: createResourceNamespace({
        baseUrl: ({ namespace, apiVersion }) =>
          `/api/${apiVersion}/namespaces/${namespace}/services`,
        pathList: ({ apiVersion }) => `/api/${apiVersion}/services`,
        configKey: "service",
        apiVersion: "v1",
        kind: "Service",
        cannotBeDeleted: cannotBeDeletedDefault,
      }),
    },
    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#serviceaccount-v1-core
    {
      type: "ServiceAccount",
      dependsOn: ["Namespace"],
      dependencies: {
        namespace: {
          type: "Namespace",
        },
      },
      inferName: inferNameNamespace,
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
    },
    {
      type: "StatefulSet",
      dependsOn: ["Namespace", "ConfigMap", "Secret", "ServiceAccount"],
      dependencies: {
        namespace: {
          type: "Namespace",
        },
        configMap: {
          type: "ConfigMap",
        },
        secret: {
          type: "Secret",
        },
        serviceAccount: {
          type: "ServiceAccount",
        },
      },
      inferName: inferNameNamespace,
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
    },
    {
      type: "StorageClass",
      inferName: inferNameNamespaceLess,
      Client: createResourceNamespaceless({
        baseUrl: ({ apiVersion }) => `/apis/${apiVersion}/storageclasses`,
        configKey: "storageClass",
        apiVersion: "storage.k8s.io/v1",
        kind: "StorageClass",
      }),
    },

    {
      type: "ReplicaSet",
      dependsOn: ["Namespace", "ConfigMap", "Secret"],
      dependencies: {
        namespace: {
          type: "Namespace",
        },
        configMap: {
          type: "ConfigMap",
        },
        secret: {
          type: "Secret",
        },
      },
      inferName: inferNameNamespace,
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
      listOnly: true,
    },
    //https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#validatingwebhookconfiguration-v1-admissionregistration-k8s-io
    {
      type: "ValidatingWebhookConfiguration",
      inferName: inferNameNamespaceLess,
      Client: createResourceNamespaceless({
        baseUrl: ({ apiVersion }) =>
          `/apis/${apiVersion}/validatingwebhookconfigurations`,
        configKey: "validatingWebhookConfiguration",
        apiVersion: "admissionregistration.k8s.io/v1",
        kind: "ValidatingWebhookConfiguration",
        cannotBeDeleted: cannotBeDeletedDefault,
      }),
    },
  ],
  map(defaultsDeep({ resourceKey, isOurMinion, compare: compareK8s() })),
  tap((params) => {
    assert(true);
  }),
]);

const readKubeConfig = ({
  kubeConfigFile = path.resolve(os.homedir(), ".kube/config"),
}) =>
  tryCatch(
    pipe([
      () => fs.readFile(kubeConfigFile, "utf-8"),
      yaml.load,
      tap((kubeConfig) => {
        //logger.info(tos(kubeConfig));
      }),
    ]),
    (error) => {
      logger.error(
        `Cannot read kube config file: ${kubeConfigFile}, error: ${error}`
      );
      //throw error;
    }
  )();

//AWS EKS
const getAuthTokenExec = pipe([
  get("exec"),
  ({ command, args }) => `${command} ${args.join(" ")}`,
  shellRun,
  JSON.parse,
  get("status.token"),
  tap((params) => {
    assert(true);
  }),
]);

//GCP GKE
const getAuthTokenAuthProvider = pipe([
  get("auth-provider.config"),
  (cmd) => `${cmd["cmd-path"]} ${cmd["cmd-args"]}`,
  shellRun,
  JSON.parse,
  get("credential.access_token"),
]);

const getAuthToken = ({ kubeConfig }) =>
  pipe([
    () => kubeConfig,
    findUser,
    tap((params) => {
      assert(true);
    }),
    switchCase([
      // GCP GKE
      get("auth-provider.config"),
      getAuthTokenAuthProvider,
      // AWS ELS
      get("exec"),
      getAuthTokenExec,
      // Azure AKS
      get("token"),
      get("token"),
      () => {
        logger.error(`getAuthToken: cannot get token`);
        return undefined;
      },
    ]),
    tap((params) => {
      assert(true);
    }),
  ])();

const providerType = "k8s";

const getListHof = ({ getList, spec }) =>
  tryCatch(getList, (error, params) =>
    pipe([
      () => {
        throw error;
      },
    ])()
  );

exports.K8sProvider = ({
  name = providerType,
  manifests = [],
  stage = "dev",
  config,
  configs = [],
  ...other
}) => {
  config && assert(isFunction(config), "config must be a function");

  //TODO use common mergedConfig
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
        //logger.info(`mergeConfig : ${tos(merged)}`);
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
            inferName: inferNameNamespace,
            dependsOn: ["Namespace", "CustomResourceDefinition"],
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
            compare: compareK8s(),
          }),
          () => ({
            type: names.kind,
            inferName: inferNameNamespaceLess,
            dependsOn: ["CustomResourceDefinition"],
            Client: createResourceNamespaceless({
              baseUrl: ({ apiVersion }) =>
                `/apis/${apiVersion}/${names.plural}`,
              configKey: names.singular,
              apiVersion: toApiVersion({ group, versions }),
              kind: names.kind,
            }),
            isOurMinion,
            compare: compareK8s(),
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
    makeConfig: () => mergedConfig,
    fnSpecs: () => [...fnSpecs(), ...manifestToSpec(manifests)],
    start,
    info,
    getListHof,
  });
};
