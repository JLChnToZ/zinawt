import { AssignableDomElement } from './utils';
declare global {
    namespace JSX {
        type Element = HTMLElement;
        type ElementClass = HTMLElement;
        type IntrinsicElementMap = {
            [tagName in keyof HTMLElementTagNameMap]: AssignableDomElement<HTMLElementTagNameMap[tagName]>;
        };
        interface IntrinsicElements extends IntrinsicElementMap {
            [tagName: string]: any;
        }
    }
}
export declare type JSXCreateElement = <T extends CustomElementConstructor | string>(tagName: T, attributes?: (T extends CustomElementConstructor ? ConstructorParameters<T>[0] : T extends keyof HTMLElementTagNameMap ? AssignableDomElement<HTMLElementTagNameMap[T] & HTMLElement> : {
    [attribute: string]: any;
}), ...children: (Node | string | number | boolean)[]) => (T extends CustomElementConstructor ? InstanceType<T> : T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : HTMLElement);
export declare type MaybeElement<T extends HTMLElement> = T | AssignableDomElement<T> | HTMLElement;
export declare function assignElementAttributes<T extends HTMLElement>(element: T, attributes?: AssignableDomElement<T>): T;
declare const _default: JSXCreateElement;
export default _default;
export declare function getCreateElementFunction(document: Document): JSXCreateElement;
//# sourceMappingURL=jsx-helper.d.ts.map