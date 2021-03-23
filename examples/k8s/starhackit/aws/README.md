# Full Stack Application on AWS EKS

This example deploys a full-stack application with Kubernetes on AWS using their managed control plane called [Elastic Kubernetes Service](https://aws.amazon.com/eks/)

## Providers

This infrastructure depends on 2 providers: AWS and Kubernetes.

![Modules](modules.svg)

## Modules

A few modules for each of these providers are being used.

### Modules for AWS resources

- [module-aws-eks](../../../../packages/modules/aws/eks/README)
- [module-aws-certificate](../../../../packages/modules/aws/certificate/README)

### Modules for K8s resources

- [module-k8s-aws-load-balancer](../../../../packages/modules/k8s/aws-load-balancer/README)
- [module-k8s-cert-manager](../../../../packages/modules/k8s/certificate/README)

## Amazon EKS

The first part of this deployment is to create an EKS control plan, a node group for the workers and all their numerous dependencies.

Configuration for the AWS resources is located at [configAws.js](./configAws.js)

Set the **rootDomainName** and **domainName** according to your use case

> For end to end automation, the **rootDomainName** should be registered or transfered to the AWS Route53 service.

## K8s

The second part is the kubernetes deployment of the full-stack application composed of a react front end, a node backend, postgres as the SQL database and finally redis for the cache and published/subscriber models.

Configuration for the K8s resources is located at [configK8s.js](./configK8s.js)

## Troubleshooting

```
kubectl get po -A
```

```
kubectl describe pods  -n kube-system aws-load-balancer-controller-5c5c56786-q7tn4
```

```
kubectl logs -n kube-system   deployment.apps/aws-load-balancer-controller
```
