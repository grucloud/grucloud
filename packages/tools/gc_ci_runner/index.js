import assert from "assert";
import rubico from "rubico";
const { pipe, tap, tryCatch } = rubico;

import GcRunner from "./GcRunner.js";

const flow = {
  //  steps: [{ name: "", run: "git clone $GIT_REPO -b $GIT_BRANCH --depth 1" }],
  steps: [{ name: "", run: "ls", workingDirectory: "node_modules" }],
};

tryCatch(
  pipe([
    () => ({ flow, Bucket: process.env.S3_BUCKET }),
    GcRunner,
    tap((result) => {
      assert(true);
    }),
  ]),
  (error) => {
    console.error(error);
    process.exit(1);
  }
)();
