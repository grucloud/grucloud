# GruCloud Module for the AWS Load Balancer Controller on Kubernetes

Integrate the [Aws Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/) with GruCloud.

## How to use this module

See a simple [example](example/README.md).

This module is also used to deploy a [full starter kit](https://github.com/grucloud/grucloud/tree/main/examples/starhackit/eks-lbc)

## Dependecencies

This module depends on the [cert-manager](https://www.npmjs.com/package/@grucloud/module-k8s-cert-manager) which install Custom Resource Definition, aka CRD

## Update manifest version

Eventually edit the manifest version in the _package.json_ at the field **.scripts.download-manifest**.

Download the manifest file locally

```
npm run download-manifest
```

## Code Generation

The load balancer controler manifest is transformed into javascript code using the **k8s-manifest2code** tool:

```
npm run gen-code
```

This commands creates the **resource.js** file containing all the resources.

## Post Edit: Cluster name

Modify the generated **resource.js** in 2 places:

- Specify the cluster name for the _LoadBalancerController Deployment_
- Add the AWS Load Balancer Role as a dependencies of _LoadBalancerController ServiceAccount_. This will link the k8s Serive Account to the Load Balancer AWS IAM Role.

```txt
git diff
diff --git a/packages/modules/k8s/aws-load-balancer/resources.js b/packages/modules/k8s/aws-load-balancer/resources.js
index d149bd7c..ae273988 100644
--- a/packages/modules/k8s/aws-load-balancer/resources.js
+++ b/packages/modules/k8s/aws-load-balancer/resources.js
@@ -558,6 +558,9 @@ exports.createResources = async ({ provider, resources }) => {
       }),
     }
   );
+  assert(provider.dependencies.aws.config.eks);
+  const clusterName = provider.dependencies.aws.config.eks.cluster.name;
+  assert(clusterName);

   const kubeSystemawsLoadBalancerControllerDeployment = await provider.makeDeployment(
     {
@@ -591,7 +594,7 @@ exports.createResources = async ({ provider, resources }) => {
               containers: [
                 {
                   args: [
-                    "--cluster-name=your-cluster-name",
+                    `--cluster-name=${clusterName}`,
                     "--ingress-class=alb",
                   ],
                   image: "amazon/aws-alb-ingress-controller:v2.1.2",
```

```txt
diff --git a/packages/modules/k8s/aws-load-balancer/resources.js b/packages/modules/k8s/aws-load-balancer/resources.js
index ae273988..76cc1aa9 100644
--- a/packages/modules/k8s/aws-load-balancer/resources.js
+++ b/packages/modules/k8s/aws-load-balancer/resources.js
@@ -323,12 +323,17 @@ exports.createResources = async ({ provider, resources }) => {
     }
   );

+  assert(resources.lbc.roleLoadBalancer);
   const kubeSystemawsLoadBalancerControllerServiceAccount = await provider.makeServiceAccount(
     {
       name: "kube-system-aws-load-balancer-controller",
-      properties: () => ({
+      dependencies: { role: resources.lbc.roleLoadBalancer },
+      properties: ({ dependencies: { role } }) => ({
         apiVersion: "v1",
         metadata: {
+          annotations: {
+            "eks.amazonaws.com/role-arn": role?.live?.Arn,
+          },
           labels: {
             "app.kubernetes.io/component": "controller",
             "app.kubernetes.io/name": "aws-load-balancer-controller",
```
