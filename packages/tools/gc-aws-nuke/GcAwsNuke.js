const assert = require("assert");
const { pipe, tap, tryCatch, map, assign, get, set } = require("rubico");
const { callProp, when, isEmpty } = require("rubico/x");
const { Cli } = require("@grucloud/core/cli/cliCommands");
const { AwsProvider } = require("@grucloud/provider-aws");
const {
  isAwsPresent,
  isAuthenticated,
} = require("@grucloud/core/cli/providers/createProjectAws");

const pkg = require("./package.json");

const { createProgram } = require("./GcAwsNukeProgram");
const { promptRegion } = require("./GcAwsNukePromptRegion");
const { getContactInformation } = require("./GcAwsNukeContactInformation");

const createStack = ({
  regions,
  includeGroups,
  profile = "default",
  includeAllResources,
}) =>
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
            includeAllResources,
            credentials: { profile },
          }),
        }),
      ])()
    ),
    (stacks) => ({ stacks }),
  ]);

const commands = {
  destroyResources: ({ program, commandOptions }) =>
    tryCatch(
      pipe([
        tap(() => {
          assert(program);
        }),
        () => ({ options: program.opts() }),
        isAwsPresent,
        assign({
          sts: pipe([get("options"), isAuthenticated]),
        }),
        when(get("sts.error"), ({ sts }) => {
          throw Error(sts.error);
        }),
        assign({
          account: pipe([get("options"), getContactInformation]),
        }),
        when(
          pipe([get("options.regions"), isEmpty]),
          set("options.regions", pipe([promptRegion]))
        ),
        ({ options }) => ({
          commandOptions,
          programOptions: options,
          createStack: createStack(options),
        }),
        Cli,
        callProp("planDestroy", { commandOptions: { all: true } }),
      ]),
      (error) => {
        throw error;
      }
    )(),
  //
  listGroups: ({ program, commandOptions = {} }) =>
    pipe([
      () => ({
        config: () => ({
          region: "us-east-1",
          includeAllResources: commandOptions.all,
        }),
      }),
      AwsProvider,
      callProp("servicesList", {}),
      tap((content) => {
        console.log(content);
      }),
    ])(),
};

exports.GcAwsNuke = ({ argv }) =>
  pipe([
    tryCatch(
      pipe([
        () => ({ version: pkg.version, argv, commands }),
        createProgram,
        callProp("parseAsync", argv),
        tap((params) => {
          assert(true);
        }),
      ]),
      (error) => {
        return { error };
      }
    ),
  ])();
