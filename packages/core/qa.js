const assert = require("assert");
const { pipe, map, tap, and, get, tryCatch } = require("rubico");
const { isEmpty, first, callProp } = require("rubico/x");
const util = require("util");
const logger = require("./logger")({ prefix: "ProviderGru" });

process.on("uncaughtException", function (err) {
  console.error("ERROR: uncaughtException");
  console.error(err);
  console.error(err.stack);
});

const { Cli } = require("./cli/cliCommands");
const { retryCall } = require("./Retry");
const isEmptyPlan = pipe([
  get("resultQuery.results[0]"),
  and([
    pipe([get("resultCreate"), isEmpty]),
    pipe([get("resultDestroy"), isEmpty]),
  ]),
]);

exports.testEnd2End = ({
  programOptions,
  title,
  listOptions,
  steps = [],
  doGraph = !process.env.CONTINUOUS_INTEGRATION,
  destroyAll = true,
}) =>
  tryCatch(
    pipe([
      () => steps,
      first,
      tap((step) => {
        assert(step, `missing first step`);
      }),
      ({ createStack, createResources, configs }) =>
        Cli({ programOptions, createStack, createResources, configs }),
      (cli) =>
        pipe([
          () => cli.info({}),
          tap((params) => {
            assert(true);
          }),
          tap.if(
            () => doGraph,
            () =>
              cli.graphTree({
                commandOptions: { title },
                programOptions: { noOpen: true },
              })
          ),
          tap.if(
            () => doGraph,
            () =>
              cli.graphTarget({
                commandOptions: { title },
                programOptions: { noOpen: true },
              })
          ),
          () =>
            cli.planDestroy({
              commandOptions: { force: true, all: destroyAll },
            }),
          () =>
            cli.list({
              commandOptions: {
                our: true,
                canBeDeleted: true,
                json: "artifacts/inventoryAfterDestroy.json",
              },
            }),
          () =>
            cli.planApply({
              commandOptions: { force: true },
            }),
          () =>
            cli.list({
              commandOptions: { our: true, canBeDeleted: true },
            }),
          () =>
            retryCall({
              name: `planQuery`,
              fn: pipe([() => ({}), cli.planQuery]),
              config: { retryCount: 2, retryDelay: 5e3 },
              isExpectedResult: isEmptyPlan,
            }),
          () =>
            cli.list({
              programOptions: {
                json: "artifacts/inventory.json",
                noOpen: true,
              },
              commandOptions: {
                ...listOptions,
              },
            }),
          () =>
            cli.genCode({
              commandOptions: {
                inventory: "artifacts/inventory.json",
                outputDir: "artifacts",
                outputEnv: "default.template.env",
                prompt: false,
              },
            }),
          () =>
            cli.list({
              programOptions: {
                json: "artifacts/inventory.json",
                noOpen: true,
              },
              commandOptions: {
                graph: true,
                our: true,
                ...listOptions,
              },
            }),
          () => steps,
          callProp("splice", 1),
          tap((params) => {
            assert(true);
          }),
          map.series(({ createStack, createResources, configs }) =>
            pipe([
              () =>
                Cli({ programOptions, createStack, createResources, configs }),
              (cliNext) =>
                pipe([
                  () => cliNext.info({}),
                  tap((params) => {
                    assert(true);
                  }),
                  () =>
                    cliNext.planApply({
                      commandOptions: { force: true },
                    }),
                  () =>
                    cli.list({
                      commandOptions: {
                        canBeDeleted: true,
                        json: "artifacts/inventoryAfterUpdate.json",
                      },
                    }),
                  () =>
                    retryCall({
                      name: `planQuery`,
                      fn: pipe([() => ({}), cliNext.planQuery]),
                      config: {
                        repeatCount: 1,
                        retryCount: 6 * 5,
                        retryDelay: 10e3,
                      },
                      isExpectedResult: isEmptyPlan,
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
              commandOptions: { canBeDeleted: true, defaultExclude: true },
              json: "artifacts/inventoryAfterDestroy.json",
            }),
        ])(),
    ]),
    (error) => {
      logger.error(`Error running tests '${title}':`);
      logger.error(util.inspect(error, { depth: 8 }));
      logger.error(error.stack);
      throw Error(error.stack);
    }
  )();
