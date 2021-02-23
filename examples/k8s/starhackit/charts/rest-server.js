const assert = require("assert");

const buildPostgresUrl = ({
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  host,
  port = "5432",
}) =>
  `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${host}:${port}/${POSTGRES_DB}?sslmode=disable`;

exports.createChartRestServer = async ({
  provider,
  resources: { namespace, postgresService, redisService },
  config,
}) => {
  const { restServer, postgres, redis } = config;
  assert(postgres);
  assert(redis);
  assert(restServer);
  assert(restServer.serviceName);
  assert(restServer.label);
  assert(restServer.port);

  assert(postgresService);
  assert(redisService);
  assert(namespace);

  const configMapName = "rest-server-config-map";

  const configMap = await provider.makeConfigMap({
    name: configMapName,
    dependencies: { namespace },
    properties: () => ({
      data: {
        NODE_CONFIG: JSON.stringify({
          db: {
            url: buildPostgresUrl({
              ...postgres.env,
              host: `${postgres.serviceName}`,
            }),
          },
          redis: {
            url: `redis://${redis.serviceName}:6379`,
          },
        }),
      },
    }),
  });

  const service = await provider.makeService({
    name: restServer.serviceName,
    dependencies: { namespace },
    properties: () => ({
      spec: {
        selector: {
          app: restServer.label,
        },
        ports: [
          {
            protocol: "TCP",
            port: restServer.port,
            targetPort: restServer.port,
          },
        ],
      },
    }),
  });

  const deploymentRestServerContent = ({
    label = "rest-server",
    image,
    version = "latest",
    port = "9000",
  }) => ({
    metadata: {
      labels: {
        app: label,
      },
    },
    spec: {
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
              name: "rest-server",
              image: `${image}:${version}`,
              ports: [
                {
                  containerPort: port,
                },
              ],
              env: [
                {
                  name: "NODE_CONFIG",
                  valueFrom: {
                    configMapKeyRef: {
                      name: configMapName,
                      key: "NODE_CONFIG",
                    },
                  },
                },
              ],
              livenessProbe: {
                httpGet: {
                  path: "/api/v1/version",
                  port: 9000,
                },
                initialDelaySeconds: 3,
                periodSeconds: 3,
              },
            },
          ],
        },
      },
    },
  });

  const deployment = await provider.makeDeployment({
    name: restServer.deploymentName,
    dependencies: {
      namespace,
      configMap,
      postgresService,
      redisService,
    },
    properties: ({ dependencies: { configMap } }) =>
      deploymentRestServerContent({
        label: restServer.label,
        configMap,
        image: restServer.container.image,
        version: restServer.container.version,
        port: restServer.port,
      }),
  });

  return {
    service,
    configMap,
    deployment,
  };
};
