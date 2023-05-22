#!/usr/bin/env node
const assert = require("assert");
const { pipe, tap, tryCatch, map } = require("rubico");
const { callProp } = require("rubico/x");
const path = require("path");
const { Cli } = require("@grucloud/core/cli/cliCommands");
const { AwsProvider } = require("@grucloud/provider-aws");

const pkg = require("./package.json");

const { createProgram } = require("./GcAwsNukeProgram");

console.log("GcAwsNuke", pkg.version);

const regions = [
  "us-east-1",
  //
  "us-west-1",
];

const includeGroups = ["IAM", "RDS"];

// TODO exclude resources

const createStack = ({ regions, includeGroups }) =>
  pipe([
    tap(() => {
      assert(regions);
    }),
    () => regions,
    map((region) =>
      pipe([
        () => ({
          providerFactory: AwsProvider,
          name: `aws-${region}`,
          directory: `aws-${region}`,
          createResources: () => [],
          config: () => ({
            projectName: "aws-nuke",
            region,
            includeGroups,
          }),
        }),
      ])()
    ),
    (stacks) => ({ stacks }),
  ]);

const main = pipe([
  tap((options) => {
    assert(options);
  }),
  () => ({
    programOptions: {},
    createStack: createStack({ regions, includeGroups }),
  }),
  Cli,
  tap((params) => {
    assert(true);
  }),
  callProp("planDestroy", {}),
  tap((params) => {
    assert(true);
  }),
]);

pipe([
  tryCatch(
    pipe([
      () => ({ version: pkg.version, argv: process.argv }),
      createProgram,
      callProp("opts"),
      main,
      tap((param) => {}),
    ]),
    (error) => {
      console.error("Error");
      console.error(error);
      throw error;
    }
  ),
])();
