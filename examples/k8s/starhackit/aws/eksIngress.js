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
      apiVersion: "networking.k8s.io/v1beta1",
      metadata: {
        annotations: {
          "kubernetes.io/ingress.class": "alb",
          "alb.ingress.kubernetes.io/scheme": "internet-facing",
          "alb.ingress.kubernetes.io/target-type": "ip",
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
