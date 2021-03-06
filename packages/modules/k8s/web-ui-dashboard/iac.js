const Dashboard = require("./resources");
exports.hooks = [];

exports.createResources = async ({ provider }) => {
  const adminUsername = "dashboard-admin-user";

  const serviceAccountAdminUser = provider.makeServiceAccount({
    name: adminUsername,
    properties: () => ({
      metadata: {
        namespace: "kubernetes-dashboard",
      },
    }),
  });

  const clusterRoleBindingAdminUser = provider.makeClusterRoleBinding({
    name: adminUsername,
    properties: () => ({
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "ClusterRole",
        name: "cluster-admin",
      },
      subjects: [
        {
          kind: "ServiceAccount",
          name: adminUsername,
          namespace: "kubernetes-dashboard",
        },
      ],
    }),
  });

  const dashboardResources = await Dashboard.createResources({ provider });

  return {
    ...dashboardResources,
    serviceAccountAdminUser,
    clusterRoleBindingAdminUser,
  };
};
