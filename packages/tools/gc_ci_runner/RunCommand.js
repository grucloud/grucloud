import assert from "assert";
import { spawn } from "node:child_process";
import Path from "node:path";

export const runCommand =
  ({ ws, sql, stream, workingDirectory = "" }) =>
  (command) =>
    new Promise((resolve, reject) => {
      assert(command);
      const cwd = Path.resolve(process.cwd(), workingDirectory);
      console.log("runCommand", command, "cwd", cwd);
      const child = spawn(command, {
        cwd,
        shell: true,
        detached: true,
        env: process.env,
      });
      child.stderr.on("data", (x) => {
        console.error(x.toString());
        stream.write(x);
      });
      child.stdout.on("data", (x) => {
        console.log(x.toString());
        stream.write(x);
      });
      child.on("error", (code) => {
        console.error("Error running", command, "code: ", code);
        reject({ code });
      });
      child.on("exit", (code) => {
        if (code !== 0) {
          reject({ code });
        } else {
          resolve({ code });
        }
      });
    });
