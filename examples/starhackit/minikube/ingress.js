const assert = require("assert");

exports.createIngress = async ({
  provider,
  config: { restServer, ui },
  resources: { namespace, serviceWebServer, serviceRestServer },
}) => {
  assert(provider);
  assert(restServer);
  assert(ui);
  assert(serviceWebServer);
  assert(serviceRestServer);

  return provider.makeIngress({
    dependencies: {
      serviceWebServer,
      serviceRestServer,
    },
    properties: () => ({
      metadata: {
        name: "ingress",
        namespace: namespace.name,
        annotations: {
          "nginx.ingress.kubernetes.io/use-regex": "true",
        },
      },
      spec: {
        rules: [
          {
            http: {
              paths: [
                {
                  path: "/api/.*",
                  pathType: "Prefix",
                  backend: {
                    service: {
                      name: restServer.serviceName,
                      port: {
                        number: restServer.port,
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            http: {
              paths: [
                {
                  path: "/.*",
                  pathType: "Prefix",
                  backend: {
                    service: {
                      name: ui.serviceName,
                      port: {
                        number: ui.port,
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
};
