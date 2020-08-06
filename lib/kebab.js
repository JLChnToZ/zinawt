"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKebab = void 0;
const utils_1 = require("./utils");
const camels = /(?<!^|-)(\p{Lu}|\d+)/gu;
const illegalTagChars = /[^\.0-9a-z-_\xC0-\xD6\xD8-\xF6\xF8-\u{037D}\u{037F}-\u{1FFF}\u{200C}-\u{200D}\u{203F}-\u{2040}\u{2070}-\u{218F}\u{2C00}-\u{2FEF}\u{3001}-\u{D7FF}\u{F900}-\u{FDCF}\u{FDF0}-\u{FFFD}\u{10000}-\u{EFFFF}]+/gu;
function toKebab(str) {
    return str.replace(utils_1.resetGlobalRegex(camels), '-$1')
        .toLowerCase()
        .replace(utils_1.resetGlobalRegex(illegalTagChars), '');
}
exports.toKebab = toKebab;
//# sourceMappingURL=kebab.js.map