"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreateElementFunction = exports.assignElementAttributes = void 0;
const utils_1 = require("./utils");
function isSolidPrimitive(obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function');
}
function isIterable(obj) {
    return typeof obj[Symbol.iterator] === 'function';
}
function isArrayLike(obj) {
    return typeof obj.length === 'number';
}
function isEventListenerObject(obj) {
    return !!obj && typeof obj === 'object' && typeof obj.handleEvent === 'function';
}
function isNode(obj) {
    var _a;
    if (!obj || typeof obj !== 'object')
        return false;
    while (obj) {
        if (((_a = obj.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'Node')
            return true;
        obj = Object.getPrototypeOf(obj);
    }
    return false;
}
const assignFn = {
    CSSStyleDeclaration(src, dest) {
        if (!src)
            return;
        switch (typeof src) {
            case 'string':
                dest.cssText = src;
                break;
            case 'object':
                for (const key in src) {
                    let value = src[key];
                    let priority;
                    switch (typeof value) {
                        case 'string':
                            const priorityIndex = value.indexOf('!');
                            if (priorityIndex >= 0) {
                                priority = value.substring(priorityIndex + 1);
                                value = value.substring(0, priorityIndex);
                            }
                            break;
                        case 'undefined':
                            break;
                        case 'object':
                            if (!value)
                                break;
                        default:
                            value = value.toString();
                            break;
                    }
                    if (value)
                        dest.setProperty(key.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase(), value, priority);
                }
                break;
        }
    },
    DOMStringMap(src, dest) {
        if (!isSolidPrimitive(src))
            return;
        Object.assign(dest, src);
    },
    DOMTokenList(src, dest) {
        if (!isSolidPrimitive(src))
            return;
        if (isIterable(src))
            for (const n of src)
                dest.add(n);
        else if (isArrayLike(src))
            for (let i = 0, l = src.length; i < l; i++)
                dest.add(src[i]);
    },
};
const empty = Object.freeze({});
function jsxCreateElement(nameOrClass, attributes, ...children) {
    let element;
    switch (typeof nameOrClass) {
        case 'string':
            element = assignElementAttributes(this.createElement(nameOrClass), attributes);
            break;
        case 'function':
            element = new nameOrClass(attributes);
            break;
    }
    return appendChildren(this, element, children);
}
function assignElementAttributes(element, attributes = empty) {
    var _a, _b;
    for (const key in attributes) {
        const value = attributes[key];
        if (key in element) {
            const target = element[key];
            switch (typeof target) {
                case 'object':
                case 'function':
                    const typeName = (_a = target === null || target === void 0 ? void 0 : target.constructor) === null || _a === void 0 ? void 0 : _a.name;
                    if (typeName) {
                        (_b = assignFn[typeName]) === null || _b === void 0 ? void 0 : _b.call(assignFn, value, target);
                        break;
                    }
                default:
                    element[key] = value;
                    break;
            }
            continue;
        }
        switch (typeof value) {
            case 'string':
                element.setAttribute(key, value);
                break;
            case 'number':
            case 'bigint':
                element.setAttribute(key, value.toString(10));
                break;
            case 'symbol':
                element.setAttribute(key, utils_1.getSymbolKey(value));
                break;
            case 'function':
                element.addEventListener(key, value);
                break;
            case 'boolean':
                if (value)
                    element.setAttribute(key, key);
                break;
            case 'undefined':
                break;
            case 'object':
            default:
                if (isEventListenerObject(value))
                    element.addEventListener(key, value, value);
                else if (value)
                    element.setAttribute(key, JSON.stringify(value));
                break;
        }
    }
    return element;
}
exports.assignElementAttributes = assignElementAttributes;
function appendChildren(document, element, children) {
    for (const child of children)
        switch (typeof child) {
            case 'undefined':
                break;
            case 'object':
                if (!child)
                    break;
                if (isNode(child)) {
                    element.appendChild(child.ownerDocument !== document ?
                        document.adoptNode(child.cloneNode(true)) :
                        child.isConnected ?
                            child.cloneNode(true) :
                            child);
                    break;
                }
            default:
                element.appendChild(document.createTextNode(child.toString()));
                break;
        }
    return element;
}
exports.default = getCreateElementFunction(window.document);
function getCreateElementFunction(document) {
    return jsxCreateElement.bind(document);
}
exports.getCreateElementFunction = getCreateElementFunction;
//# sourceMappingURL=jsx-helper.js.map