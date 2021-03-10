exports.createClusterRole = async ({ provider, config: { clusterRole } }) => {
  return provider.makeClusterRole({
    name: clusterRole.name,
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
};
