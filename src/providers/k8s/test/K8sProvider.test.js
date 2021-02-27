const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const { K8sProvider } = require("../K8sProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe.only("K8sProvider", async function () {
  let config;
  let provider;
  let namespace;
  let deployment;
  let configMap;
  let storageClass;
  let persistentVolume;
  let serviceWeb;
  let serviceAccount;
  let secret;
  const myNamespace = "test";
  const serviceWebName = "web-service";
  const deploymentWebName = "web-deployment";
  const labelApp = "web";
  const storageClassName = "my-storage-class";
  const pv = { name: "pv-db" };
  const serviceAccountName = "sa-test";
  const secretName = "pg-secret";
  const postgres = {
    statefulSetName: "postgres-statefulset",
    label: "db",
  };

  const types = [
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
  ];

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = K8sProvider({
      config: config.k8s,
    });

    await provider.start();

    namespace = await provider.makeNamespace({
      name: myNamespace,
    });

    secret = await provider.makeServiceAccount({
      name: secretName,
      dependencies: { namespace },
      properties: () => ({}),
    });

    serviceAccount = await provider.makeServiceAccount({
      name: serviceAccountName,
      dependencies: { namespace },
      properties: () => ({}),
    });

    configMap = await provider.makeConfigMap({
      name: "config-map",
      dependencies: { namespace },
      properties: () => ({
        data: {
          POSTGRES_USER: "dbuser",
          POSTGRES_PASSWORD: "peggy went to the market",
          POSTGRES_DB: "main",
        },
      }),
    });

    storageClass = await provider.makeStorageClass({
      name: storageClassName,
      properties: () => ({
        provisioner: "kubernetes.io/no-provisioner",
        volumeBindingMode: "WaitForFirstConsumer",
      }),
    });

    serviceWeb = await provider.makeService({
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

    ingress = await provider.makeIngress({
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

    persistentVolume = await provider.makePersistentVolume({
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

    /*
    persistentVolumeClaim = await provider.makePersistentVolumeClaim({
      name: pvc.name,
      dependencies: { namespace, storageClass },
      properties: () => ({
        spec: {
          accessModes: ["ReadWriteOnce"],
          storageClassName: "",
          resources: {
            requests: {
              storage: "1Gi",
            },
          },
        },
      }),
    });
*/
    const deploymentContent = ({ configMap, name, labelApp }) => ({
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

    deployment = await provider.makeDeployment({
      name: deploymentWebName,
      dependencies: { namespace, configMap },
      properties: ({ dependencies: { configMap } }) =>
        deploymentContent({ labelApp, configMap }),
    });

    const statefulPostgresContent = ({ configMap, name, label, pvName }) => ({
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
                        name: configMap.resource.name,
                        key: "POSTGRES_USER",
                      },
                    },
                  },

                  {
                    name: "POSTGRES_PASSWORD",
                    valueFrom: {
                      configMapKeyRef: {
                        name: configMap.resource.name,
                        key: "POSTGRES_PASSWORD",
                      },
                    },
                  },
                  {
                    name: "POSTGRES_DB",
                    valueFrom: {
                      configMapKeyRef: {
                        name: configMap.resource.name,
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

    statefulSetPostgres = await provider.makeStatefulSet({
      name: postgres.statefulSetName,
      dependencies: { namespace, configMap, persistentVolume },
      properties: ({ dependencies: { configMap } }) =>
        statefulPostgresContent({
          label: postgres.label,
          configMap,
          pvName: pv.name,
        }),
    });
  });
  after(async () => {});

  it("k8s deployment apply and destroy", async function () {
    await testPlanDeploy({ provider, types });
    const deploymentLive = await deployment.getLive();

    const {
      results: [deployments],
    } = await provider.listLives({ options: { types } });
    const resource = deployments.resources[0].data;
    //assert.equal(deployments.type, "ElasticIpAddress");
    //assert.equal(resource.Domain, "vpc");
    //assert(resource.PublicIp);

    await testPlanDestroy({ provider, types });
  });
});
