const assert = require("assert");
const { pipe, tap, get, map, omit, switchCase } = require("rubico");
const Axios = require("axios");
const yaml = require("js-yaml");
const prettier = require("prettier");
const changeCase = require("change-case");
const fs = require("fs").promises;

//const manifestUrl =
// "https://raw.githubusercontent.com/kubernetes-sigs/aws-alb-ingress-controller/v1.1.8/docs/examples/rbac-role.yaml";
//console.log(process.argv);
//const manifestUrl =
// "https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/v2_1_3_full.yaml";
const resourceName = ({ metadata, kind }) =>
  `${changeCase.camelCase(metadata.name)}${kind}`;

const writeResources = map((manifest) =>
  pipe([
    tap(() => {
      //console.log(manifest);
    }),
    () => manifest.metadata.name,
    (name) => `const ${resourceName(manifest)} = await provider.make${
      manifest.kind
    }({
    name: "${name}",
    properties: () => (${JSON.stringify(
      omit(["kind", "metadata.name"])(manifest),
      null,
      4
    )})
})
`,
    tap((code) => {
      console.log(code);
    }),
    (code) => ({ manifest, code }),
  ])()
);
exports.main = (options) =>
  pipe([
    tap(() => {
      assert(options.input, "options.input");
    }),
    () => options.input,
    switchCase([
      () => true, //TODO is file or url ?
      pipe([() => fs.readFile(options.input)]),
      pipe([() => Axios.get(options.input), get("data")]),
    ]),

    tap((result) => {
      //console.log(result);
    }),
    yaml.loadAll,
    tap((result) => {
      console.log(`${result.length} resources`);
    }),
    writeResources,
    tap((code) => {
      //console.log(code);
    }),
    (results) => `
  // Generated by k8s-manifest2code from ${options.input}
  const assert = require("assert")
  exports.createResources = async ({ provider, resources }) => {
${map(get("code"))(results).join("\n")}

return {
    ${pipe([
      () => results,
      map(pipe([get("manifest"), resourceName, (name) => `${name},`])),
      (results) => results.join("\n"),
    ])()}
}
}
`,
    tap((formatted) => {
      assert(formatted);
    }),
    prettier.format,
    tap((formatted) => {
      console.log(formatted);
    }),
    (formatted) => fs.writeFile(options.output || "./resources.js", formatted),
  ])();
