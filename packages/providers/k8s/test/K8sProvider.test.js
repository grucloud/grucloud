const assert = require("assert");
const { K8sProvider } = require("../K8sProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("K8sProvider", async function () {
  let config;
  let provider;

  let namespace;
  const myNamespace = "test";

  let deployment;
  const deploymentWebName = "web-deployment";

  let configMap;
  const configMapName = "postgres-config-map";
  let storageClass;
  const storageClassName = "my-storage-class";

  let persistentVolume;
  let serviceWeb;
  const serviceWebName = "web-service";

  let serviceAccount;
  const serviceAccountName = "sa-test";

  let secret;
  const secretName = "pg-secret";

  let clusterRole;
  const clusterRoleName = "cluster-role";

  let clusterRoleBinding;
  const clusterRoleBindingName = "cluster-binding-role";

  let role;
  let roleName = "aws-load-balancer-controller-leader-election-role";

  const labelApp = "web";
  const pv = { name: "pv-db" };

  const postgres = {
    statefulSetName: "postgres-statefulset",
    label: "db",
  };

  const types = [
    "Namespace",
    "ConfigMap",
    "Deployment",
    "Ingress",
    "PersistentVolume",
    "PersistentVolumeClaim",
    "Secret",
    "Service",
    "ServiceAccount",
    "StatefulSet",
    "StorageClass",
    "ClusterRole",
    "ClusterRoleBinding",
    "CustomResourceDefinition",
    "MutatingWebhookConfiguration",
    "Role",
    "RoleBinding",
  ];

  before(async function () {
    provider = K8sProvider({
      config: () => ({}),
    });

    namespace = provider.makeNamespace({
      name: myNamespace,
    });

    serviceAccount = provider.makeServiceAccount({
      name: serviceAccountName,
      dependencies: { namespace },
      properties: () => ({}),
    });

    clusterRole = provider.makeClusterRole({
      name: clusterRoleName,
      properties: () => ({
        apiVersion: "rbac.authorization.k8s.io/v1",
        kind: "ClusterRole",
        metadata: {
          labels: {
            "app.kubernetes.io/name": "alb-ingress-controller",
          },
        },
        rules: [
          {
            apiGroups: ["", "extensions"],
            resources: [
              "configmaps",
              "endpoints",
              "events",
              "ingresses",
              "ingresses/status",
              "services",
              "pods/status",
            ],
            verbs: ["create", "get", "list", "update", "watch", "patch"],
          },
          {
            apiGroups: ["", "extensions"],
            resources: ["nodes", "pods", "secrets", "services", "namespaces"],
            verbs: ["get", "list", "watch"],
          },
        ],
      }),
    });

    clusterRoleBinding = provider.makeClusterRole({
      name: clusterRoleBindingName,
      dependencies: { clusterRole, serviceAccount },
      properties: () => ({
        metadata: {
          labels: {
            "app.kubernetes.io/name": "alb-ingress-controller",
          },
        },
        roleRef: {
          apiGroup: "rbac.authorization.k8s.io",
          kind: "ClusterRole",
          name: clusterRole.name,
        },
        subjects: [
          {
            kind: "ServiceAccount",
            name: serviceAccount.name,
            namespace: "kube-system",
          },
        ],
      }),
    });

    role = provider.makeClusterRole({
      name: roleName,
      properties: () => ({}),
    });

    secret = provider.makeSecret({
      name: secretName,
      dependencies: { namespace },
      properties: () => ({}),
    });

    configMap = provider.makeConfigMap({
      name: configMapName,
      dependencies: { namespace },
      properties: () => ({
        data: {
          POSTGRES_USER: "dbuser",
          POSTGRES_PASSWORD: "peggy went to the market",
          POSTGRES_DB: "main",
        },
      }),
    });

    storageClass = provider.makeStorageClass({
      name: storageClassName,
      properties: () => ({
        provisioner: "kubernetes.io/no-provisioner",
        volumeBindingMode: "WaitForFirstConsumer",
      }),
    });

    serviceWeb = provider.makeService({
      name: serviceWebName,
      properties: () => ({
        spec: {
          selector: {
            app: labelApp,
          },
          ports: [
            {
              protocol: "TCP",
              port: 80,
              targetPort: 80,
            },
          ],
        },
      }),
    });

    ingress = provider.makeIngress({
      name: "ingress",
      dependencies: { namespace, serviceWeb },
      properties: () => ({
        spec: {
          rules: [
            {
              http: {
                paths: [
                  {
                    path: "/",
                    pathType: "Prefix",
                    backend: {
                      service: {
                        name: serviceWebName,
                        port: {
                          number: 80,
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      }),
    });

    persistentVolume = provider.makePersistentVolume({
      name: pv.name,
      dependencies: { namespace },
      properties: () => ({
        spec: {
          accessModes: ["ReadWriteOnce"],
          capacity: {
            storage: "2Gi",
          },
          hostPath: {
            path: "/data/pv0001/",
          },
        },
      }),
    });

    const deploymentContent = ({ labelApp }) => ({
      metadata: {
        labels: {
          app: labelApp,
        },
      },
      spec: {
        replicas: 3,
        selector: {
          matchLabels: {
            app: labelApp,
          },
        },
        template: {
          metadata: {
            labels: {
              app: labelApp,
            },
          },
          spec: {
            containers: [
              {
                name: "nginx",
                image: "nginx:1.14.2",
                ports: [
                  {
                    containerPort: 80,
                  },
                ],
              },
            ],
          },
        },
      },
    });

    deployment = provider.makeDeployment({
      name: deploymentWebName,
      dependencies: { namespace, configMap },
      properties: ({ dependencies: { configMap } }) =>
        deploymentContent({ labelApp, configMap }),
    });

    const statefulPostgresContent = ({ label, pvName }) => ({
      metadata: {
        labels: {
          app: label,
        },
      },
      spec: {
        serviceName: "postgres",
        replicas: 1,
        selector: {
          matchLabels: {
            app: label,
          },
        },
        template: {
          metadata: {
            labels: {
              app: label,
            },
          },
          spec: {
            containers: [
              {
                name: "postgres",
                image: "postgres:10-alpine",
                ports: [
                  {
                    containerPort: 5432,
                    name: "postgres",
                  },
                ],
                volumeMounts: [
                  {
                    name: pvName,
                    mountPath: "/var/lib/postgresql",
                  },
                ],
                env: [
                  {
                    name: "POSTGRES_USER",
                    valueFrom: {
                      configMapKeyRef: {
                        name: configMapName,
                        key: "POSTGRES_USER",
                      },
                    },
                  },

                  {
                    name: "POSTGRES_PASSWORD",
                    valueFrom: {
                      configMapKeyRef: {
                        name: configMapName,
                        key: "POSTGRES_PASSWORD",
                      },
                    },
                  },
                  {
                    name: "POSTGRES_DB",
                    valueFrom: {
                      configMapKeyRef: {
                        name: configMapName,
                        key: "POSTGRES_DB",
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
        volumeClaimTemplates: [
          {
            metadata: {
              name: pvName,
            },
            spec: {
              accessModes: ["ReadWriteOnce"],
              resources: {
                requests: {
                  storage: "1Gi",
                },
              },
            },
          },
        ],
      },
    });

    statefulSetPostgres = provider.makeStatefulSet({
      name: postgres.statefulSetName,
      dependencies: { namespace, configMap, persistentVolume },
      properties: ({ dependencies: { configMap } }) =>
        statefulPostgresContent({
          label: postgres.label,
          configMap,
          pvName: pv.name,
        }),
    });
    await provider.start();
  });
  after(async () => {});

  it("k8s deployment apply and destroy", async function () {
    try {
      await testPlanDeploy({ provider, types });

      await testPlanDestroy({ provider, types });
    } catch (error) {
      throw error;
    }
  });
});
