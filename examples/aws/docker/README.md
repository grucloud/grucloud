# Dockerize the AWS GruCloud Provider

The objective is to run `gc list` on any AWS account, without the need for writing any infrastrucure code. This code should run on servers as well, not only on local computer. hence GruCloud will be dockerized.

A docker image will be created with the GruCloud CLI, the AWS Provider with no resources defined. See [iac.js](./iac.js)

## Configuration

Create a file `aws.env` with the AWS access and secret key, as well as the region:

```txt
AWSAccessKeyId=AAAAAASSSSSSCCCCCCXXXX
AWSSecretKey=EErr4455gfderttgdbgyfdovksfbokdfo
AWS_REGION=us-east-1
```

## Build the docker image

Build the image named `grucloud-aws`:

```sh
npm run docker:build
```

Verify the newly created images:

```sh
docker images grucloud-aws
```

```txt
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
grucloud-aws        latest              24fa2a869648        43 minutes ago      227MB
```

> The build process is multi-stage, which produces a lean image.

## Run gc from the image

For all gc commands:

- The environment is taken from the file `aws.env`
- The `volume` directory is mounted where the results will be written.

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
docker run --entrypoint /bin/sh -it grucloud-aws
```
