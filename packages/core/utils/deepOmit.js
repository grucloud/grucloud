const assert = require("assert");
const { pipe, tap, get, omit, reduce, switchCase, set, or } = require("rubico");
const {
  when,
  callProp,
  isObject,
  identity,
  isEmpty,
  includes,
  unless,
  isString,
} = require("rubico/x");

const removeKeyBracket = pipe([callProp("replace", "[]", "")]);
const hasKeyBracket = pipe([includes("[]")]);

const deepOmitByPath =
  ([firstKey, ...remainingKeys]) =>
  (source) =>
    pipe([
      () => firstKey,
      (firstKey) => [firstKey],
      (firstKeyArray) =>
        pipe([
          () => source,
          tap((params) => {
            assert(true);
          }),
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
                      when(
                        get(removeKeyBracket(firstKey)),
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
                pipe([
                  tap((params) => {
                    assert(true);
                  }),
                  when(
                    isObject,
                    pipe([
                      omit([firstKeyArray]),
                      tap((params) => {
                        assert(true);
                      }),
                    ])
                  ),
                ]),
                // has remaining keys
                pipe([
                  get(firstKeyArray),
                  deepOmitByPath(remainingKeys),
                  (objNested) =>
                    pipe([
                      () => source,
                      when(get(firstKeyArray), set(firstKeyArray, objNested)),
                    ])(),
                ]),
              ]),
            ]),
          ]),
        ])(),
    ])();

exports.deepOmitByPath = deepOmitByPath;

const deepOmit = (paths) => (source) =>
  pipe([
    () => source,
    unless(
      or([isEmpty, () => paths === undefined]),
      pipe([
        () => paths,
        reduce(
          (acc, path) =>
            pipe([
              () => acc,
              deepOmitByPath(
                pipe([
                  () => path,
                  tap((params) => {
                    assert(true);
                  }),
                  when(isString, callProp("split", ".")),
                ])()
              ),
            ])(),
          source
        ),
      ])
    ),
  ])();

exports.deepOmit = deepOmit;
