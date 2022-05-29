const assert = require("assert");
const { pipe, tap, get, omit, reduce, switchCase, set } = require("rubico");
const {
  when,
  callProp,
  isObject,
  identity,
  isEmpty,
  includes,
  unless,
} = require("rubico/x");

const removeKeyBracket = pipe([callProp("replace", "[]", "")]);
const hasKeyBracket = pipe([includes("[]")]);

const deepOmitByPath =
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
            // no key
            pipe([() => source]),
            // has key
            pipe([
              // TODO back to map
              reduce(
                (acc, item) =>
                  pipe([
                    () => item,
                    deepOmitByPath(remainingKeys),
                    (newItem) => [...acc, newItem],
                  ])(),
                []
              ),
              (objNested) =>
                pipe([
                  () => source,
                  unless(
                    () => isEmpty(objNested),
                    set(removeKeyBracket(firstKey), objNested)
                  ),
                ])(),
            ]),
          ]),
        ]),
        // No array
        pipe([
          switchCase([
            () => isEmpty(remainingKeys),
            // no remaining keys
            pipe([when(isObject, omit([firstKey]))]),
            // has remaining keys
            pipe([
              get(firstKey),
              deepOmitByPath(remainingKeys),
              (objNested) =>
                pipe([
                  () => source,
                  unless(() => isEmpty(objNested), set(firstKey, objNested)),
                ])(),
            ]),
          ]),
        ]),
      ]),
    ])();

exports.deepOmitByPath = deepOmitByPath;

const deepOmit = (paths) => (source) =>
  pipe([
    () => source,
    unless(
      isEmpty,
      pipe([
        () => paths,
        reduce(
          (acc, path) =>
            pipe([
              () => acc,
              deepOmitByPath(pipe([() => path, callProp("split", ".")])()),
            ])(),
          source
        ),
      ])
    ),
  ])();

exports.deepOmit = deepOmit;
