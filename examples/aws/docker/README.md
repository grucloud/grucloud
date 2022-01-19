# Dockerize the GruCloud Providers

The objective is to run `gc list` on any cloud provider, without the need for writing any infrastructure code. This code should run on servers as well, not only on local computer. Hence GruCloud will be dockerized.

A docker image will be created with the GruCloud CLI, the AWS Provider without resource defined. See [iac.js](./iac.js)

## Configuration

### AWS configuration

Create the file `aws.env` with the AWS access and secret key, as well as the region:

```sh
AWSAccessKeyId=AAAAAASSSSSSCCCCCCXXXX
AWSSecretKey=EErr4455gfderttgdbgyfdovksfbokdfo
AWS_REGION=us-east-1
```

### Azure configuration

Create the file `azure.env`:

```sh
AZURE_TENANT_ID=f5252b5d-13f4-45e9-ad17-aaaaaaaaa
AZURE_SUBSCRIPTION_ID=8e0e234e-8384-438d-a652-aaaaaaaaa
AZURE_CLIENT_ID=4c5c4428-e25a-42dd-9506-aaaaaaaaa
AZURE_CLIENT_SECRET=Fye-0irzz9xxmrcsq8enX2Y_aaaaaaaaa
LOCATION=uksouth
```

### OpenStack OVH configuration

Create the file `openstack.env`:

```sh
OS_REGION_NAME=UK1
OS_AUTH_URL=https://auth.cloud.ovh.net/v3
OS_PROJECT_ID=
OS_PROJECT_NAME=
OS_USERNAME=
OS_PASSWORD=
```

## Build the docker image

Build the image named `grucloud-cli`:

```sh
npm run docker:build
```

Verify the newly created images:

```sh
docker images grucloud-cli
```

```txt
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
grucloud-cli        latest              24fa2a869648        43 minutes ago      227MB
```

> The build process is multi-stage, which produces a lean image.

## Run gc from the image

For all gc commands:

- The environment is taken from the file `aws.env`
- The `volume` directory is mounted where the results will be written.

### Version

Get the `gc` version from the image:

```sh
npm run gc:version
```

### Info

The command is a wrapper to the `docker run` command, and will execute `gc info`:

```sh
npm run gc:info
```

### List

Run `gc:list` inside the container:

```sh
npm run gc:list
```

The result of the list command is written in `volume/gc-list.json`.

### Troubleshooting

Run a shell inside a container to inspect its content:

```sh
docker run --entrypoint /bin/sh -it grucloud-cli
```
