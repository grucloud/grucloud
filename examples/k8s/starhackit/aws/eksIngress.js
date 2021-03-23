const assert = require("assert");

exports.createIngress = async ({
  provider,
  resources: { namespace, certificate, serviceWebServer, serviceRestServer },
}) => {
  assert(provider);
  const { restServer, ui } = provider.config;
  assert(restServer);
  assert(ui);
  assert(serviceWebServer);
  assert(serviceRestServer);
  assert(certificate);

  return provider.makeIngress({
    name: "ingress",
    dependencies: {
      namespace,
      certificate,
    },
    properties: ({ dependencies: { certificate } }) => ({
      apiVersion: "networking.k8s.io/v1beta1",
      metadata: {
        annotations: {
          "kubernetes.io/ingress.class": "alb",
          "alb.ingress.kubernetes.io/scheme": "internet-facing",
          "alb.ingress.kubernetes.io/listen-ports":
            '[{"HTTPS":443}, {"HTTP":80}]',
          "alb.ingress.kubernetes.io/certificate-arn":
            certificate?.live?.CertificateArn,
        },
      },
      spec: {
        rules: [
          {
            http: {
              paths: [
                {
                  path: "/api/*",
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
                  path: "/*",
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
