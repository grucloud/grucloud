const path = require("path");
const fs = require("fs");
const shell = require("shelljs");

const examplesPath = "../examples";
const programName = "gc";

const cmds = [
  { cmd: "list" },
  { cmd: "deploy" },
  { cmd: "list -o" },
  { cmd: "destroy" },
  { cmd: "list" },
];

const specs = [
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
      `*****************************************************************************************`
    );
    console.log(`run '${runCommand}' in ${spec.path}`);
    console.log(
      `*****************************************************************************************`
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
