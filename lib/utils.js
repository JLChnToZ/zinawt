"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bind = exports.getSymbolKey = exports.resetGlobalRegex = void 0;
const symbolMatcher = /^Symbol\((.*)\)$/;
function resetGlobalRegex(matcher) {
    matcher.lastIndex = 0;
    return matcher;
}
exports.resetGlobalRegex = resetGlobalRegex;
function getSymbolKey(sym) {
    return sym.toString().replace(symbolMatcher, '$1');
}
exports.getSymbolKey = getSymbolKey;
exports.Bind = (target, key, descriptor) => {
    const Type = target.constructor;
    if (descriptor.get || descriptor.set)
        throw new TypeError(`${Type.name}.${key.toString()} ` +
            'has already defined a getter/setter, ' +
            'which is not suppported to use decorator to bind it, ' +
            'consider to manually use Function.bind() in the getter/setter.');
    let orgValue = descriptor.value;
    const { writable, enumerable } = descriptor;
    descriptor.get = function () {
        if (this === target)
            return orgValue;
        const value = typeof orgValue === 'function' ?
            Function.prototype.bind.call(orgValue, this) :
            orgValue;
        for (let o = this; o instanceof Type; o = Object.getPrototypeOf(o))
            if (Object.prototype.hasOwnProperty.call(o, key))
                return value;
        Object.defineProperty(this, key, {
            value, configurable: true, writable, enumerable,
        });
        return value;
    };
    if (writable) {
        descriptor.set = function (value) {
            if (this === target)
                return orgValue = value;
            Object.defineProperty(this, key, {
                value, configurable: true, writable: true, enumerable: true,
            });
        };
        delete descriptor.writable;
    }
    delete descriptor.value;
    return descriptor;
};
//# sourceMappingURL=utils.js.map