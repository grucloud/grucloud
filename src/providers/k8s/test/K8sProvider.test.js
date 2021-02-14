const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const { K8sProvider } = require("../K8sProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("K8sProvider", async function () {
  let config;
  let provider;
  let namespace;
  let deployment;
  let configMap;
  let storageClass;
  let persistentVolumeClaim;
  let serviceWeb;
  const myNamespace = "test";
  const resourceName = "app-deployment";
  const labelApp = "app";
  const storageClassName = "my-storage-class";

  const types = ["Deployment", "StorageClass", "ConfigMap"];
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

    configMap = await provider.makeConfigMap({
      name: "config-map",
      dependencies: { namespace },
      properties: () => ({ data: { myKey: "myValue" } }),
    });

    storageClass = await provider.makeConfigMap({
      name: storageClassName,
      properties: () => ({
        provisioner: "kubernetes.io/no-provisioner",
        volumeBindingMode: "WaitForFirstConsumer",
      }),
    });

    serviceWeb = await provider.makeService({
      name: "web-service",
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

    persistentVolumeClaim = await provider.makePersistentVolumeClaim({
      name: "persistent-volume-claim",
      dependencies: { storageClass },
      properties: () => ({
        spec: {
          accessModes: ["ReadWriteOnce"],
          storageClassName: storageClassName,
          resources: {
            requests: {
              storage: "1Gi",
            },
          },
        },
      }),
    });

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
      name: resourceName,
      dependencies: { namespace, configMap },
      properties: ({ dependencies: { configMap } }) =>
        deploymentContent({ labelApp, configMap }),
    });
  });
  after(async () => {});

  it.only("k8s deployment apply and destroy", async function () {
    await testPlanDeploy({ provider, types });
    const deploymentLive = await deployment.getLive();

    const {
      results: [deployments],
    } = await provider.listLives({ types });
    const resource = deployments.resources[0].data;
    //assert.equal(deployments.type, "ElasticIpAddress");
    //assert.equal(resource.Domain, "vpc");
    //assert(resource.PublicIp);

    await testPlanDestroy({ provider, types });
  });
});
