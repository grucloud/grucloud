import assert from "assert";
import rubico from "rubico";
const { pipe, tap } = rubico;
import { describe, it } from "node:test";

import GcRunner from "../GcRunner.js";

const flowSimple = {
  name: "Bau",
  on: {
    push: {
      branches: ["*"],
    },
  },
  steps: [
    {
      name: "git clone",
      run: "git clone $GIT_REPO -b $GIT_BRANCH my_repo",
      workingDirectory: "",
    },
    {
      name: "npm install",
      run: "npm install",
      workingDirectory: "my_repo",
    },
    {
      name: "gc list",
      run: "gc list",
      workingDirectory: "my_repo",
    },
  ],
};

describe("GcRunner", () => {
  it("happy case", async () =>
    pipe([
      tap((result) => {
        assert(true);
      }),
      () => ({ argv: [""], flow: flowSimple }),
      GcRunner,
      tap((result) => {
        assert(true);
      }),
    ])());
});
