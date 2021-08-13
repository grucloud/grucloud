const assert = require("assert");
const { pipe, map, tap } = require("rubico");
const { Cli } = require("./cli/cliCommands");

exports.testEnd2End = ({
  programOptions,
  createStack,
  title,
  listOptions,
  configs = [],
}) =>
  pipe([
    () => Cli({ programOptions, createStack }),
    (cli) =>
      pipe([
        () =>
          cli.graphTree({
            commandOptions: { title },
            programOptions: { noOpen: true },
          }),
        () =>
          cli.graphTarget({
            commandOptions: { title },
            programOptions: { noOpen: true },
          }),
        () =>
          cli.planDestroy({
            commandOptions: { force: true },
          }),
        () =>
          cli.list({
            commandOptions: { our: true, canBeDeleted: true },
          }),
        //emptyResult,
        () =>
          cli.planApply({
            commandOptions: { force: true },
          }),
        () =>
          cli.list({
            programOptions: {
              json: "artifacts/inventory.json",
              noOpen: true,
            },
            commandOptions: {
              graph: true,
              ...listOptions,
            },
          }),
        () =>
          cli.genCode({
            commandOptions: {
              input: "artifacts/inventory.json",
            },
          }),
        () => configs,
        map((config) =>
          pipe([
            () => Cli({ programOptions, createStack, config }),
            (cliNext) =>
              pipe([
                //() => cliNext.info({}),
                () =>
                  cliNext.planApply({
                    commandOptions: { force: true },
                  }),
                () =>
                  cliNext.list({
                    commandOptions: { our: true },
                  }),
                () =>
                  cliNext.planApply({
                    commandOptions: { force: true },
                  }),
              ])(),
          ])()
        ),
        () =>
          cli.planDestroy({
            commandOptions: { force: true },
          }),
        () =>
          cli.list({
            commandOptions: { canBeDeleted: true },
          }),
      ])(),
  ])();
