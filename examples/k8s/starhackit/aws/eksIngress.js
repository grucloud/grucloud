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
    name: "ingress",
    dependencies: {
      namespace,
      serviceWebServer,
      serviceRestServer,
    },
    properties: () => ({
      metadata: {
        annotations: {
          "kubernetes.io/ingress.class": "alb",
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
                    serviceName: restServer.serviceName,
                    servicePort: restServer.port,
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
                    serviceName: ui.serviceName,
                    servicePort: ui.port,
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
