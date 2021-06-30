const { resolve } = require("path");
const { readdir } = require("fs").promises;
const { pipe, map, filter } = require("rubico");
const { includes } = require("rubico/x");
const ExcludesFiles = [".DS_Store", ".git"];

const getFilesWalk = ({ dir, dirResolved, excludesFiles }) =>
  pipe([
    () => readdir(dir, { withFileTypes: true }),
    filter(({ name }) => !includes(name)(excludesFiles)),
    map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory()
        ? getFilesWalk({ dir: res, dirResolved })
        : res;
    }),
    (files) => files.flat(),
    map((file) => file.replace(`${dirResolved}/`, "")),
  ])();

exports.getFiles = async ({ dir, excludesFiles = ExcludesFiles }) => {
  const dirResolved = resolve(dir);
  const files = await getFilesWalk({ dir, excludesFiles, dirResolved });
  return files;
};
