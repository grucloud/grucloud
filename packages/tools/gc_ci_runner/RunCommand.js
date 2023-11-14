import assert from "assert";
import { spawn } from "node:child_process";
import Path from "node:path";

export const runCommand =
  ({ ws, sql, workingDirectory = "" }) =>
  (command) =>
    new Promise((resolve, reject) => {
      assert(command);
      let result = "";
      const cwd = Path.resolve(process.cwd(), workingDirectory);
      const child = spawn(command, {
        cwd,
        shell: true,
        detached: true,
        env: process.env,
      });
      child.stderr.on("data", (x) => {
        console.error(x.toString());
        result += x.toString();
      });
      child.stdout.on("data", (x) => {
        console.log(x.toString());

        result += x.toString();
      });
      child.on("error", (code) => {
        console.error("Error running", command, "code: ", code);
        reject({ code });
      });
      child.on("exit", (code) => {
        if (code !== 0) {
          reject({ code, result });
        } else {
          resolve({ code, result });
        }
      });
    });
