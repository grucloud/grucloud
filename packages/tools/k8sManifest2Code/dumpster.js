const path = require("path");
const { readdir } = require("fs").promises;
const { pipe, map, filter, switchCase, tap } = require("rubico");
const { includes, identity, callProp, isEmpty } = require("rubico/x");

const exludesFiles = [".DS_Store"];
//TODO include pattern

const fileMatch = ({ includePattern, name }) =>
  pipe([
    () => (!isEmpty(includePattern) ? name.match(includePattern) : true),
    tap((match) => {
      if (!match) {
        assert(true);
      }
    }),
  ]);

const getFilesWalk = ({ dir, dirResolved, includePattern }) =>
  pipe([
    () => readdir(dir, { withFileTypes: true }),
    filter(({ name }) => !includes(name)(exludesFiles)),
    filter(({ name }) => fileMatch({ name, includePattern })),
    map((dirEntry) =>
      pipe([
        () => path.resolve(dir, dirEntry.name),
        switchCase([
          () => dirEntry.isDirectory(),
          (res) => getFilesWalk({ dir: res, dirResolved }),
          identity,
        ]),
      ])()
    ),
    callProp("flat"),
    map((file) => file.replace(`${dirResolved}/`, "")),
  ])();

exports.getFiles = ({ dir, includePattern }) =>
  pipe([
    () => path.resolve(dir),
    (dirResolved) => getFilesWalk({ dir, dirResolved, includePattern }),
  ])();
