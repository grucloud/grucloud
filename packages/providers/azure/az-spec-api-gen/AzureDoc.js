const assert = require("assert");
const { pipe, tap, map, get, switchCase, eq } = require("rubico");
const {
  append,
  prepend,
  callProp,
  isEmpty,
  values,
  isObject,
  find,
} = require("rubico/x");
const path = require("path");
const fse = require("fs-extra");
const prettier = require("prettier");
const util = require("util");
const { createSpecsOveride, findByGroupAndType } = require("../AzureSpec");

const buildDocResourceFilename =
  ({ directoryDoc }) =>
  ({ group, type }) =>
    pipe([
      () => path.resolve(directoryDoc, group, `${type}.md`),
      tap((params) => {
        assert(true);
      }),
    ])();

const createHeader = ({ type }) =>
  pipe([
    () => `---
id: ${type}
title: ${type}
---
`,
  ])();

const createSummary = ({ type, group }) =>
  pipe([() => `Provides a **${type}** from the **${group}** group\n`])();

const buildProperties = ({ example }) =>
  pipe([
    tap((params) => {
      assert(example);
    }),
    () => example,
    get("parameters"),
    tap((params) => {
      assert(example);
    }),
    (parameters) => {
      for (key in parameters) {
        const value = parameters[key];
        if (isObject(value)) {
          return value;
        }
      }
    },
    switchCase([
      isEmpty,
      () => "",
      pipe([JSON.stringify, prepend("properties: () => ("), append("),\n")]),
    ]),
  ])();

//TODO search for deps in example
const buildDependencies = ({ example, dependencies }) =>
  pipe([
    tap((params) => {
      assert(dependencies);
    }),
    () => dependencies,
    map.entries(([dependencyName, { type, group, list }]) => [
      dependencyName,
      pipe([
        tap(() => {
          assert(type);
          assert(group);
        }),
        switchCase([
          () => list,
          () => `${dependencyName}: ["my${type}"]`,
          () => `${dependencyName}: "my${type}"`,
        ]),
        ,
      ])(),
    ]),
    values,
    callProp("join", ","),
    switchCase([
      isEmpty,
      () => "",
      pipe([prepend("dependencies:({}) => ({"), append("})\n")]),
    ]),
  ])();

const prettierMakeResource = ({ group, type, example, dependencies }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    () =>
      `exports.createResources = () => [{ type: "${type}", group: "${group}",
        name: "my${type}",
        ${buildProperties({ example })}${buildDependencies({
        example,
        dependencies,
      })}}]`,
    tap((params) => {
      assert(true);
    }),
    (content) => prettier.format(content, { parser: "babel" }),
  ])();

const createExampleSection = ({ type, group, name, example, dependencies }) =>
  pipe([
    tap((params) => {
      assert(name);
      assert(example);
    }),
    () => `### ${name}\n`,
    append(`\`\`\`js
${prettierMakeResource({
  group,
  type,
  example,
  dependencies,
})}
\`\`\`\n`),
  ])();

const createExamplesSection = ({ methods, type, group, dependencies }) =>
  pipe([
    () => methods,
    get("put"),
    get("x-ms-examples", {}),
    tap((params) => {
      assert(true);
    }),
    map.entries(([name, example]) => [
      name,
      createExampleSection({ name, example, type, group, dependencies }),
    ]),
    values,
    callProp("join", "\n"),
    prepend("## Examples\n"),
  ])();

const createSchemaSection = ({ methods }) =>
  pipe([
    tap((params) => {
      assert(methods);
    }),
    () => methods,
    get("put.parameters"),
    find(eq(get("in"), "body")),
    tap((params) => {
      assert(true);
    }),
    get("schema", ""),
    (schema) => util.inspect(schema, { depth: 15 }),
    (content) => `\`\`\`js
${content}
\`\`\`
`,
    prepend("## Swagger Schema\n"),
  ])();

const createDependenciesSection = ({ dependencies }) =>
  pipe([
    () => dependencies,
    map(({ group, type }) => `- [${type}](../${group}/${type}.md)`),
    values,
    callProp("join", "\n"),
    prepend("## Dependencies\n"),
    append("\n"),
  ])();

const createMisc = ({ dir, apiVersion }) =>
  pipe([
    () => "## Misc\n",
    append(`The resource version is \`${apiVersion}\`.\n\n`),
    append(
      `The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/${dir}).\n`
    ),
  ])();

const createDocContent =
  () =>
  ({ type, group, apiVersion, methods, dependencies, dir }) =>
    pipe([
      tap((params) => {
        assert(type);
        // TODO
        //assert(dir);
      }),
      () => "",
      append(createHeader({ type })),
      append(createSummary({ type, group })),
      append(createExamplesSection({ methods, type, group, dependencies })),
      append(createDependenciesSection({ dependencies })),
      append(createSchemaSection({ methods, type, group, dependencies })),
      append(createMisc({ dir, apiVersion })),
      tap((params) => {
        assert(true);
      }),
    ])();

const writeDocResource =
  ({ directoryDoc }) =>
  (resource) =>
    pipe([
      tap(() => {
        assert(resource);
        assert(directoryDoc);
      }),
      () => resource,
      createDocContent({}),
      tap((content) =>
        fse.outputFile(
          buildDocResourceFilename({ directoryDoc })(resource),
          content
        )
      ),
    ])();

exports.writeDoc = ({ directoryDoc }) =>
  pipe([
    tap((params) => {
      assert(directoryDoc);
    }),
    map((specGen) =>
      pipe([
        () => ({}),
        createSpecsOveride,
        findByGroupAndType(specGen),
        tap((specOveride) => {
          assert(true);
        }),
        (specOveride) => ({ ...specGen, ...specOveride }),
        tap((params) => {
          assert(true);
        }),
      ])()
    ),
    tap((params) => {
      assert(true);
    }),
    map(writeDocResource({ directoryDoc })),
  ]);
