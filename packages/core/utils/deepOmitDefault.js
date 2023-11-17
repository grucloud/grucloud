const assert = require("assert");
const {
  pipe,
  tap,
  map,
  get,
  reduce,
  switchCase,
  set,
  eq,
  omit,
} = require("rubico");
const { when, callProp, isEmpty, includes, unless } = require("rubico/x");

const removeKeyBracket = pipe([callProp("replace", "[]", "")]);
const hasKeyBracket = pipe([includes("[]")]);

const deepOmitDefaultByPath =
  ([[firstKey, ...remainingKeys], defaultValue]) =>
  (source = {}) =>
    pipe([
      tap((params) => {
        assert(true);
      }),

      () => source,
      switchCase([
        () => isEmpty(remainingKeys),
        // No more remaining keys
        pipe([
          tap((params) => {
            assert(true);
          }),
          when(eq(get(firstKey), defaultValue), omit([firstKey])),
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
                  map(
                    pipe([deepOmitDefaultByPath([remainingKeys, defaultValue])])
                  ),
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
              deepOmitDefaultByPath([remainingKeys, defaultValue]),
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

exports.deepOmitDefaultByPath = deepOmitDefaultByPath;

exports.deepOmitDefaults = (defaultValues) => (source) =>
  pipe([
    () => defaultValues,
    switchCase([
      isEmpty,
      () => source,
      reduce(
        (acc, item) =>
          pipe([
            () => acc,
            deepOmitDefaultByPath(
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
