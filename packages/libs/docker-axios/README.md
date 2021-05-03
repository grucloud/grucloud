# Node client library for Docker

A lean implementation of a node client targeting the Docker API.

```sh
npm i @grucloud/docker-axios
```

- Based on [axios](https://github.com/axios/axios) for commnucation with the docker API: UNIX socket and HTTP
- Implemented with the amazing functional programming library [rubico](https://rubico.land/docs/), a better alternative to lodash and ramda.

## Setup

### Create a Docker client

Import the `DockerClient` from [@grucloud/docker-axios](https://www.npmjs.com/package/@grucloud/docker-axios).

Create a client with _options_. These options are forwarded to [axios](https://github.com/axios/axios#request-config)

```js
const { DockerClient } = require("@grucloud/docker-axios");

const docker = DockerClient({
  baseURL: "http://localhost/v1.40",
  socketPath: "/var/run/docker.sock",
  timeout: 15e3,
});
```

## Container API

Examples of the docker container API:

- list
- create
- start
- wait
- delete

### Create a container

Please refer to the offical [ContainerCreate documentation](https://docs.docker.com/engine/api/v1.41/#operation/ContainerCreate) for a detailed list of the parameter.

```js
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const containerImage = "grucloud-aws";
const localVolume = "volume";
const localVolumePath = path.resolve(localVolume);
const containerName = `${containerImage}-${uuidv4()}`;

const createParam = {
  name: containerName,
  body: {
    Image: containerImage,
    Cmd: ["help"],
    HostConfig: {
      Binds: [`${localVolumePath}:/app/output`],
    },
  },
};
const result = await docker.container.create(createParam);
assert(result.Id);
```

### Start a container

Start a container by name, options in [ContainerStart](https://docs.docker.com/engine/api/v1.41/#operation/ContainerStart)

```js
const startParam = {
  name: containerName,
};
await docker.container.start(startParam);
```

### Wait for a container

Wait for a container to finished.

```js
const waitParam = {
  name: containerName,
};
const result = await docker.container.wait(waitParam);
assert.equal(result.StatusCode, 0);
```

### List containers

List all containers, options defined in [ContainerList](https://docs.docker.com/engine/api/v1.41/#operation/ContainerList)

```js
const result = await docker.container.list({});
```

List a container by name:

```js
const result = await docker.container.list({
  filters: `{"name": ["${containerName}"]}`,
});
assert.equal(result.length, 1);
```

### Retrieve container logs

Obtaint the logs from the container by name. See all options at [ContainerLogs](https://docs.docker.com/engine/api/v1.41/#operation/ContainerLogs)

```js
const logParam = {
  name: containerName,
  options: {
    stdout: 1,
    stderr: 1,
    //tail: 100,
    //follow: 0,
  },
};
const result = await docker.container.log(logParam);
console.log(result);
```

### Destroy a container

Delete a container by name, options in [ContainerDelete](https://docs.docker.com/engine/api/v1.41/#operation/ContainerDelete)

```js
const destroyParam = {
  name: containerName,
};
await docker.container.delete(destroyParam);
```
