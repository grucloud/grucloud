## Starhackit on minikube

This code deploys [starhackit](https://github.com/FredericHeem/starhackit) on minikube.

Ensure minikube is installed:

```
minikube version
```

Ensure minikube is up and running:

```
minikube start
```

For this project, enable the ingress addon:

```
minikube addons enable ingress
```

Do not forget to glance at the kubernetes dashboard:

```
minikube dashboard
```
