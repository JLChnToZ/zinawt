"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectAttribute = exports.ObserveAttribute = exports.CustomElement = void 0;
const utils_1 = require("./utils");
const kebab_1 = require("./kebab");
const commonPrefixPostfix = /(?:^(?:html))|(?:(?:custom)?(?:element|component|handler)$)/gi;
const tagNameMap = new Map([
    [window.HTMLAnchorElement, 'a'],
    [window.HTMLAppletElement, 'applet'],
    [window.HTMLAreaElement, 'area'],
    [window.HTMLAudioElement, 'audio'],
    [window.HTMLBaseElement, 'base'],
    [window.HTMLBaseFontElement, 'basefont'],
    [window.HTMLBodyElement, 'body'],
    [window.HTMLBRElement, 'br'],
    [window.HTMLButtonElement, 'button'],
    [window.HTMLCanvasElement, 'canvas'],
    [window.HTMLDataElement, 'data'],
    [window.HTMLDataListElement, 'datalist'],
    [window.HTMLDetailsElement, 'details'],
    [window.HTMLDialogElement, 'dialog'],
    [window.HTMLDirectoryElement, 'dir'],
    [window.HTMLDivElement, 'div'],
    [window.HTMLDListElement, 'dl'],
    [window.HTMLEmbedElement, 'embed'],
    [window.HTMLFieldSetElement, 'fieldset'],
    [window.HTMLFontElement, 'font'],
    [window.HTMLFormElement, 'form'],
    [window.HTMLFrameElement, 'frame'],
    [window.HTMLFrameSetElement, 'frameset'],
    [window.HTMLHeadElement, 'head'],
    [window.HTMLHRElement, 'hr'],
    [window.HTMLHtmlElement, 'html'],
    [window.HTMLIFrameElement, 'iframe'],
    [window.HTMLImageElement, 'img'],
    [window.HTMLInputElement, 'input'],
    [window.HTMLLabelElement, 'label'],
    [window.HTMLLegendElement, 'legend'],
    [window.HTMLLIElement, 'li'],
    [window.HTMLLinkElement, 'link'],
    [window.HTMLMapElement, 'map'],
    [window.HTMLMarqueeElement, 'marquee'],
    [window.HTMLMenuElement, 'menu'],
    [window.HTMLMetaElement, 'meta'],
    [window.HTMLMeterElement, 'meter'],
    [window.HTMLObjectElement, 'object'],
    [window.HTMLOListElement, 'ol'],
    [window.HTMLOptGroupElement, 'optgroup'],
    [window.HTMLOptionElement, 'option'],
    [window.HTMLOutputElement, 'output'],
    [window.HTMLParagraphElement, 'p'],
    [window.HTMLParamElement, 'param'],
    [window.HTMLPictureElement, 'picture'],
    [window.HTMLPreElement, 'pre'],
    [window.HTMLProgressElement, 'progress'],
    [window.HTMLScriptElement, 'script'],
    [window.HTMLSelectElement, 'select'],
    [window.HTMLSlotElement, 'slot'],
    [window.HTMLSourceElement, 'source'],
    [window.HTMLSpanElement, 'span'],
    [window.HTMLStyleElement, 'style'],
    [window.HTMLTableCaptionElement, 'caption'],
    [window.HTMLTableDataCellElement, 'td'],
    [window.HTMLTableElement, 'table'],
    [window.HTMLTableHeaderCellElement, 'th'],
    [window.HTMLTableRowElement, 'tr'],
    [window.HTMLTemplateElement, 'template'],
    [window.HTMLTextAreaElement, 'textarea'],
    [window.HTMLTimeElement, 'time'],
    [window.HTMLTitleElement, 'title'],
    [window.HTMLTrackElement, 'track'],
    [window.HTMLUListElement, 'ul'],
    [window.HTMLVideoElement, 'video'],
]);
const observeAttributesMap = new WeakMap();
function guessTagName(proto) {
    for (let o = proto; o != null; o = Object.getPrototypeOf(o)) {
        const tag = tagNameMap.get(o.constructor);
        if (tag != null)
            return tag;
    }
    throw new TypeError('No matching tag name.');
}
function assignAttribute(mappings, target, value) {
    for (const mapping of mappings)
        try {
            const converted = convert(mapping.type, value);
            if (converted !== undefined)
                target[mapping.key] = converted;
            else if (mapping.optional)
                target[mapping.key] = undefined;
        }
        catch (e) {
            console.error(e);
        }
}
function convert(type, value) {
    switch (type) {
        case 'boolean':
            return value != null;
        case 'string':
            if (value != null)
                return value;
            break;
        case 'number':
            if (value != null)
                return parseFloat(value);
            break;
        case 'bigint':
            if (value != null)
                return BigInt(value);
        case 'json':
            if (value != null)
                return JSON.parse(value);
            break;
    }
}
function keyToAttrName(key) {
    return kebab_1.toKebab(typeof key === 'symbol' ? utils_1.getSymbolKey(key) : key.toString());
}
function CustomElement(target = null, ext = false) {
    switch (typeof target) {
        case 'function':
            const Class = target;
            target = null;
            return wrap(Class);
        case 'boolean':
            ext = target;
            target = null;
            break;
    }
    return wrap;
    function wrap(Class) {
        const WrappedClass = class extends Class {
            static get observedAttributes() {
                var _a;
                const manual = super.observedAttributes;
                const auto = (_a = observeAttributesMap.get(Class)) === null || _a === void 0 ? void 0 : _a.keys();
                return manual != null && auto != null ? [...manual, ...auto] : manual !== null && manual !== void 0 ? manual : auto;
            }
            constructor(...args) {
                super(...args);
                const attr = observeAttributesMap.get(Class);
                if (attr)
                    for (const [name, mapping] of attr)
                        if (this.hasAttribute(name))
                            assignAttribute(mapping, this, this.getAttribute(name));
            }
            attributeChangedCallback(name, oldValue, newValue) {
                var _a, _b;
                if (oldValue !== newValue) {
                    const mapping = (_a = observeAttributesMap.get(Class)) === null || _a === void 0 ? void 0 : _a.get(name);
                    if (mapping)
                        assignAttribute(mapping, this, newValue);
                }
                (_b = super.attributeChangedCallback) === null || _b === void 0 ? void 0 : _b.call(this, name, oldValue, newValue);
            }
        };
        window.customElements.define(typeof target === 'string' ? target : kebab_1.toKebab(Class.name.trim().replace(utils_1.resetGlobalRegex(commonPrefixPostfix), '')), WrappedClass, {
            extends: ext === true ? guessTagName(Class.prototype) : ext || undefined,
        });
        return WrappedClass;
    }
}
exports.CustomElement = CustomElement;
function ObserveAttribute(name, type = 'string', optional) {
    return (target, key, property) => {
        const Class = target.constructor;
        const mapping = { key, type, optional };
        let mappings = observeAttributesMap.get(Class);
        if (!mappings)
            observeAttributesMap.set(Class, mappings = new Map());
        const attrName = name !== null && name !== void 0 ? name : keyToAttrName(key);
        const mappingList = mappings.get(attrName);
        if (mappingList)
            mappingList.push(mapping);
        else
            mappings.set(attrName, [mapping]);
        return property;
    };
}
exports.ObserveAttribute = ObserveAttribute;
/** Make the property reflects to the value of an attribute. */
function ReflectAttribute(name, type) {
    return (target, key) => {
        const attrName = name !== null && name !== void 0 ? name : keyToAttrName(key);
        let get;
        let set;
        switch (type) {
            case 'string':
            case null:
            case undefined:
                get = function () {
                    return this.getAttribute(attrName);
                };
                break;
            case 'boolean':
                get = function () {
                    return this.hasAttribute(attrName);
                };
                set = function (value) {
                    if (value)
                        this.setAttribute(attrName, '');
                    else
                        this.removeAttribute(attrName);
                };
                break;
            case 'json':
                set = function (value) {
                    if (value != null)
                        this.setAttribute(attrName, JSON.stringify(value));
                    else
                        this.removeAttribute(attrName);
                };
                break;
        }
        if (!get)
            get = function () {
                return convert(type, this.getAttribute(attrName));
            };
        if (!set)
            set = function (value) {
                if (value != null)
                    this.setAttribute(attrName, value.toString());
                else
                    this.removeAttribute(attrName);
            };
        Object.defineProperty(target, key, { configurable: true, get, set });
    };
}
exports.ReflectAttribute = ReflectAttribute;
//# sourceMappingURL=custom-element.js.map