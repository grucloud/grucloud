# Full Stack Application on AWS EKS

## Dos

- https://docs.aws.amazon.com/eks/latest/userguide/specify-service-account-role.html

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
