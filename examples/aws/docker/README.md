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
AZURE_LOCATION=uksouth
```

## Build the docker image

Build the image named `grucloud/grucloud-cli`:

```sh
npm run docker:build
```

Verify the newly created images:

```sh
docker images grucloud/grucloud-cli
```

```txt
REPOSITORY              TAG       IMAGE ID       CREATED       SIZE
grucloud/grucloud-cli   latest    c9fd0a82fe56   9 hours ago   670MB
```

> The build process is multi-stage, which produces a lean image.

## Run gc from the image

For all gc commands:

- The environment is taken from the file `aws.env`
- The `output` directory is mounted where the results will be written.

### Version

Get the `gc` version from the image:

```sh
npm run gc:version
```

### Info

The command is a wrapper to the `docker run` command, and will execute `gc info`:

```sh
npm run gc:info:aws
```

### List

Run `gc:list` inside the container:

```sh
npm run gc:list:aws
```

The result of the list command is written in `output/gc-list.json`.

### Troubleshooting

Run a shell inside a container to inspect its content:

```sh
docker run --mount type=bind,source=$PWD/output,target=/app/output --entrypoint /bin/sh -it grucloud/grucloud-cli
```
