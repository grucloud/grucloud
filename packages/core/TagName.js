exports.toTagName = (name, tag) => `${name}${tag}`;
exports.fromTagName = (name, tag) => name && name.replace(tag, "");
exports.hasTag = (name = "", tag) => name.includes(tag);
