const { pipe, or, tap, get, map, pick, reduce, switchCase } = require("rubico");
const {
  callProp,
  when,
  identity,
  isEmpty,
  defaultsDeep,
  includes,
  unless,
} = require("rubico/x");

const removeKeyBracket = callProp("replace", "[]", "");
const hasKeyBracket = includes("[]");

const deepPickByPath =
  ([firstKey, ...remainingKeys]) =>
  (source) =>
    pipe([
      () => source,
      switchCase([
        isEmpty,
        identity,
        () => hasKeyBracket(firstKey),
        // Deal with array
        pipe([
          get(removeKeyBracket(firstKey)),
          switchCase([
            isEmpty,
            () => ({}),
            pipe([
              map(pipe([deepPickByPath(remainingKeys)])),
              (results) => ({ [removeKeyBracket(firstKey)]: results }),
            ]),
          ]),
        ]),
        // No array
        pipe([
          pick([firstKey]),
          when(
            () => !isEmpty(remainingKeys),
            // has remaining keys
            pipe([
              get(firstKey),
              deepPickByPath(remainingKeys),
              switchCase([
                isEmpty,
                () => ({}),
                (objNested) => ({ [firstKey]: objNested }),
              ]),
            ])
          ),
        ]),
      ]),
    ])();

exports.deepPickByPath = deepPickByPath;

const deepPick = (paths) => (source) =>
  pipe([
    () => source,
    unless(
      or([isEmpty, () => paths == undefined]),
      pipe([
        () => paths,
        reduce(
          (acc, path) =>
            pipe([
              () => source,
              deepPickByPath(pipe([() => path, callProp("split", ".")])()),
              (obj) => pipe([() => acc, defaultsDeep(obj)])(),
            ])(),
          {}
        ),
      ])
    ),
  ])();

exports.deepPick = deepPick;
