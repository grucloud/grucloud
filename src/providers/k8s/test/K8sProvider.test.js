const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const { K8sProvider } = require("../K8sProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("K8sDeployment", async function () {
  let config;
  let provider;
  let namespace;
  let deployment;
  let configMap;
  const myNamespace = "test";
  const resourceName = "app-deployment";
  const labelApp = "app";

  const types = ["Deployment"];
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

    const configMapContent = ({}) => ({ data: { myKey: "myValue" } });

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

    namespace = await provider.makeNamespace({
      name: myNamespace,
    });

    configMap = await provider.makeConfigMap({
      name: "config-map",
      properties: () => configMapContent({}),
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
