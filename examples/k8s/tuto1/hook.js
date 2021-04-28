const assert = require("assert");
const Axios = require("axios");
const { pipe, tap, eq, get, or } = require("rubico");
const { first } = require("rubico/x");
const { retryCallOnError } = require("@grucloud/core").Retry;
const shell = require("shelljs");

module.exports = ({ resources, provider }) => {
  const localPort = 8081;
  const url = `http://localhost:${localPort}`;

  const servicePort = pipe([
    () => resources.service.properties({}),
    get("spec.ports"),
    first,
    get("port"),
  ])();
  assert(servicePort);

  const kubectlPortForwardCommand = `kubectl --namespace ${resources.namespace.name} port-forward svc/${resources.service.name} ${localPort}:${servicePort}`;

  const axios = Axios.create({
    timeout: 15e3,
    withCredentials: true,
  });

  return {
    onDeployed: {
      init: async () => {
        return {};
      },
      actions: [
        {
          name: `exec: '${kubectlPortForwardCommand}', check web server at ${url}`,
          command: async () => {
            // start kubectl port-forward
            var child = shell.exec(kubectlPortForwardCommand, { async: true });
            child.stdout.on("data", function (data) {});

            // Retry to get the web page.
            await retryCallOnError({
              name: `get ${url}`,
              fn: () => axios.get(url),
              shouldRetryOnException: ({ error }) =>
                or([
                  eq(get("code"), "ECONNREFUSED"),
                  eq(get("response.status"), 404),
                ])(error),
              isExpectedResult: (result) => {
                assert(result.headers["content-type"], `text/html`);
                return [200].includes(result.status);
              },
              config: { retryCount: 20, retryDelay: 5e3 },
            });
            // Open a browser
            shell.exec(`open ${url}`, { async: true });
          },
        },
      ],
    },
    onDestroyed: {
      init: () => {},
    },
  };
};
