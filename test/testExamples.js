const path = require("path");
const fs = require("fs");
const shell = require("shelljs");
const { pipe, tap, map, any, switchCase, filter } = require("rubico");
const flatten = require("rubico/x/flatten");
const examplesPath = "../examples";
const programName = "gc";

const cmds = [
  { cmd: "list" },
  { cmd: "destroy --force" },
  { cmd: "list" },
  { cmd: "destroy --force" },
  { cmd: "apply --force" },
  { cmd: "list -o" },
  { cmd: "apply --force" },
  { cmd: "destroy --force" },
  { cmd: "list" },
];

const specs = [
  {
    path: "mock",
    cmds,
  },
  {
    path: "aws/s3",
    cmds,
  },
  {
    path: "aws/ec2",
    cmds,
  },
  {
    path: "aws/ec2-vpc",
    cmds,
  },
  {
    path: "multi",
    cmds,
  },
  {
    path: "azure",
    cmds,
  },
  {
    path: "google/vm",
    cmds,
  },
  {
    path: "google/vm-network",
    cmds,
  },
];

const processExample = (spec) => {
  const examplePath = path.join(__dirname, examplesPath, spec.path);
  if (!fs.existsSync(examplePath)) {
    const msg = `directory  ${examplePath} does not exist`;
    console.error(msg);
    throw Error(msg);
  }
  shell.cd(examplePath);
  const result = spec.cmds.map(({ cmd }) => {
    const runCommand = `${programName} ${cmd}`;
    console.log(
      `\n*****************************************************************************************`
    );
    console.log(`***    run '${runCommand}' in ${spec.path}`);
    console.log(
      `*****************************************************************************************\n`
    );
    const { stdout, stderr, code } = shell.exec(runCommand);
    return {
      path: spec.path,
      cmd,
      stdout,
      stderr,
      code,
    };
  });

  return result;
};

const hasError = pipe([flatten, any((result) => result.code != 0)]);

const doError = pipe([
  tap(() => {
    console.error("Error occured:");
  }),
  filter((result) => result.code != 0),
  tap((results) => {
    console.error(JSON.stringify(results, null, 4));
  }),
  tap(() => {
    process.exit(-1);
  }),
]);

const doSuccess = () => {
  console.log("Success !");
  process.exit(0);
};

pipe([
  map((spec) => processExample(spec)),
  //
  switchCase([hasError, doError, doSuccess]),
])(specs);
