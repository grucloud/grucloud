const assert = require("assert");
const { pipe, tap, map, get, reduce, switchCase, set } = require("rubico");
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

const deepDefaultByPath =
  ([[firstKey, ...remainingKeys], defaultValue]) =>
  (source = {}) =>
    pipe([
      () => source,
      switchCase([
        () => isEmpty(remainingKeys),
        // No more remaining keys
        pipe([
          unless(
            callProp("hasOwnProperty", firstKey),
            set(firstKey, defaultValue)
          ),
        ]),
        // More remaining keys
        pipe([
          switchCase([
            () => hasKeyBracket(firstKey),
            // Is array
            pipe([
              get(removeKeyBracket(firstKey)),
              switchCase([
                isEmpty,
                // no key
                pipe([() => source]),
                // has key
                pipe([
                  map(pipe([deepDefaultByPath([remainingKeys, defaultValue])])),
                  (childObj) =>
                    pipe([
                      () => source,
                      unless(
                        () => isEmpty(childObj),
                        set(removeKeyBracket(firstKey), childObj)
                      ),
                    ])(),
                ]),
              ]),
            ]),
            // No array
            pipe([
              get(firstKey),
              deepDefaultByPath([remainingKeys, defaultValue]),
              (childObj) =>
                pipe([
                  () => source,
                  unless(() => isEmpty(childObj), set(firstKey, childObj)),
                ])(),
            ]),
          ]),
        ]),
      ]),
    ])();

exports.deepDefaultByPath = deepDefaultByPath;

exports.deepDefaults = (defaultValues) => (source) =>
  pipe([
    () => defaultValues,
    switchCase([
      isEmpty,
      () => source,
      reduce(
        (acc, item) =>
          pipe([
            () => acc,
            deepDefaultByPath(
              pipe([
                () => item,
                ([path, defaultValue]) =>
                  pipe([
                    () => path,
                    callProp("split", "."),
                    (keys) => [keys, defaultValue],
                  ])(),
              ])()
            ),
          ])(),
        source
      ),
    ]),
  ])();
