const path = require("path");
const fs = require("fs");
const shell = require("shelljs");

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
    path: "azure",
    cmds,
  },
  {
    path: "multi",
    cmds,
  },
  {
    path: "aws",
    cmds,
  },
  {
    path: "google",
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
      cmd,
      stdout,
      stderr,
      code,
    };
  });

  return result;
};

const results = specs.map((spec) => processExample(spec));
//console.log(results);
