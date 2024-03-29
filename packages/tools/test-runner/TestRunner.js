const assert = require("assert");
const {
  map,
  pipe,
  tap,
  eq,
  get,
  tryCatch,
  switchCase,
  filter,
} = require("rubico");
const { find, isEmpty, unless, size, isIn } = require("rubico/x");
const { spawn } = require("child_process");

const { createSpinnies } = require("./SpinniesUtils");

const environments = [
  //
  //{ awsAccount: "default" },
  { awsAccount: "e2e-alpha" },
  { awsAccount: "e2e-bravo" },
  { awsAccount: "e2e-charly" },
  { awsAccount: "e2e-delta" },
  { awsAccount: "e2e-echo" },
  { awsAccount: "e2e-foxtrot" },
  { awsAccount: "e2e-golf" },
  { awsAccount: "e2e-hotel" },
  { awsAccount: "e2e-india" },
  { awsAccount: "e2e-juliett" },
  { awsAccount: "e2e-kilo" },
  { awsAccount: "e2e-lima" },
  { awsAccount: "e2e-mike" },
  { awsAccount: "e2e-november" },
  { awsAccount: "e2e-oscar" },
  { awsAccount: "e2e-papa" },
];

exports.environments = environments;

const executeCommand = ({ command, environment }) =>
  pipe([
    tap((directory) => {
      assert(environment);
      assert(command);
      assert(directory);
    }),
    (directory) =>
      new Promise((resolve, reject) => {
        const child = spawn(command, {
          //stdio: "inherit",
          shell: true,
          detached: true,
          cwd: directory,
          env: {
            ...process.env,
            AWS_PROFILE: environment.awsAccount,
            CONTINUOUS_INTEGRATION: true,
          },
        });
        child.stderr.on("data", (x) => {
          console.error(x.toString());
        });
        child.stdout.on("data", (x) => {
          //console.log(x.toString());
        });
        child.on("error", (code) => {
          console.error(directory, "error", code);
          reject(code);
        });
        child.on("exit", (code) => {
          console.log(directory, "exit", code);
          if (code !== 0) {
            reject(code);
          } else {
            resolve(code);
          }
        });
      }),
    tap((directory) => {
      assert(true);
    }),
  ]);

const buildContextSummary = ({ total, completed }) => ({
  uri: "summary",
  displayText: (state) => `${state.completed}/${state.total} tests `,
  state: { completed, total },
});

const buildContext = ({ directory, name, environment }) => ({
  uri: directory,
  displayText: () => `${name.padEnd(32, " ")} [${environment.awsAccount}]`,
});

const runCommandWrapper = ({
  resultMap,
  command,
  environment,
  onStateChange,
}) =>
  pipe([
    tap(({ directory, name }) => {
      assert(environment);
      assert(command);
      assert(directory);
      assert(name);
      assert(resultMap);
      assert(onStateChange);
    }),
    tryCatch(
      ({ directory, name }) =>
        pipe([
          tap(() => {
            resultMap.set(directory, { state: "running" });
            onStateChange({
              context: buildContext({ directory, name, environment }),
              nextState: "WAITING",
            });
            onStateChange({
              context: buildContext({ directory, name, environment }),
              nextState: "RUNNING",
            });
          }),
          () => directory,
          executeCommand({ command, environment }),
          tap(() => {
            resultMap.set(directory, { state: "done" });
            onStateChange({
              context: buildContext({ name, directory, environment }),
              nextState: "DONE",
            });
            onStateChange({
              context: buildContextSummary({
                completed: findCompletedCount({ resultMap }),
                total: resultMap.size,
              }),
              nextState: "RUNNING",
            });
          }),
        ])(),
      (error, { directory, name }) =>
        pipe([
          tap(() => {
            resultMap.set(directory, { state: "error", error });
            onStateChange({
              context: buildContext({ name, directory, environment }),
              nextState: "ERROR",
              error,
            });
          }),
        ])()
    ),
    () => ({ resultMap, environment }),
    findNextDirectory,
    switchCase([
      isEmpty,
      () => ({ resultMap }),
      pipe([
        // Recursive
        (params) =>
          runCommandWrapper({ command, resultMap, environment, onStateChange })(
            params
          ),
      ]),
    ]),
  ]);

const findNextDirectory = ({ resultMap, environment }) =>
  pipe([
    //
    () => [...resultMap.values()],
    find(eq(get("state"), "init")),
  ])();

const findCompletedCount = ({ resultMap }) =>
  pipe([
    () => [...resultMap.values()],
    filter(pipe([get("state"), isIn(["done", "error"])])),
    size,
  ])();

const testRunner =
  ({ command, environments }) =>
  (testSuite) =>
    pipe([
      tap((params) => {
        assert(environments);
        assert(command);
        assert(testSuite);
      }),
      () => testSuite,
      map(({ directory, name }) => [
        directory,
        { state: "init", directory, name },
      ]),
      (mapInit) => ({
        resultMap: new Map(mapInit),
        ...createSpinnies(),
      }),
      tap(({ resultMap, onStateChange }) =>
        pipe([
          tap((params) => {
            onStateChange({
              context: buildContextSummary({
                completed: 0,
                total: size(testSuite),
              }),
              nextState: "WAITING",
            });
          }),
          () => environments,
          map((environment) =>
            pipe([
              () => ({ resultMap, environment }),
              findNextDirectory,
              unless(
                isEmpty,
                runCommandWrapper({
                  command,
                  resultMap,
                  environment,
                  onStateChange,
                })
              ),
            ])()
          ),
        ])()
      ),
      tap(({ spinnies, resultMap }) => {
        spinnies.stopAll();
      }),
    ])();

exports.testRunner = testRunner;
