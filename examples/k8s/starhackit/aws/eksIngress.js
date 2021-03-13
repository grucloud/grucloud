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

  // See https://github.com/stacksimplify/aws-eks-kubernetes-masterclass/blob/f46e2b15533a96b7641662656cf5deebb63d5dae/11-DevOps-with-AWS-Developer-Tools/Application-Manifests/kube-manifests/03-DEVOPS-Nginx-ALB-IngressService.yml
  //  # External DNS - For creating a Record Set in Route53
  // external-dns.alpha.kubernetes.io/hostname: devops.kubeoncloud.com
  return provider.makeIngress({
    name: "ingress",
    dependencies: {
      namespace,
      //serviceWebServer,
      //serviceRestServer,
    },
    properties: () => ({
      apiVersion: "networking.k8s.io/v1beta1",
      metadata: {
        annotations: {
          "kubernetes.io/ingress.class": "alb",
          "alb.ingress.kubernetes.io/scheme": "internet-facing",
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
