const assert = require("assert");
const Axios = require("axios");
const { pipe, tap, eq, get, or } = require("rubico");
const { first } = require("rubico/x");
const { retryCallOnError } = require("@grucloud/core").Retry;
const shell = require("shelljs");

module.exports = ({ provider }) => {
  const localPort = 8081;

  const axios = Axios.create({
    timeout: 15e3,
    withCredentials: true,
  });

  return {
    onDeployed: {
      init: async () => {
        const url = `http://localhost:${localPort}`;
        const resources = provider.resources();
        const serviceName = "nginx-service";
        const service = resources.Service[`myapp::${serviceName}`];
        assert(service);
        const servicePort = pipe([
          () => service.properties({}),
          get("spec.ports"),
          first,
          get("port"),
        ])();
        assert(servicePort);

        const kubectlPortForwardCommand = `kubectl --namespace ${resources.Namespace.myapp.name} port-forward svc/${serviceName} ${localPort}:${servicePort}`;

        return { kubectlPortForwardCommand, url };
      },
      actions: [
        {
          name: `exec: check web server at`,
          command: async ({ kubectlPortForwardCommand, url }) => {
            // start kubectl port-forward
            var child = shell.exec(kubectlPortForwardCommand, { async: true });
            child.stdout.on("data", function (data) {
              //console.log(data);
            });
            child.stderr.on("data", function (data) {
              console.error(data);
            });

            // child.on("exit", function (code, signal) {
            //   console.log(
            //     `${kubectlPortForwardCommand} code ${code} and signal ${signal}`
            //   );
            // });
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
