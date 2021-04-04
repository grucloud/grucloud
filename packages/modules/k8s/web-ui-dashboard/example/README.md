# GruCloud example for the Kubernetes Web UI Dashboard

This GruCloud example allows to deploy the [Kubernetes Web UI Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)

Find out the secret key to access the dashboard:

```sh
npm run key
```

Start the proxy:

```sh
kubectl proxy
```

Open the following URL to discover the dashboard:

```
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/overview?namespace=default
```
