import { TypeMap } from './utils';
declare type ConvertibleTypes = 'string' | 'number' | 'boolean' | 'bigint' | 'json';
interface ObservedTypeMap extends TypeMap {
    json: any;
}
export interface ICustomElement extends HTMLElement {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    adoptedCallback?(): void;
    attributeChangedCallback?(name: string, oldValue: string | null, newValue: string | null): void;
}
/** Wraps the custom element class with dynamic attribute observers and registers it. */
export declare function CustomElement(isExtends?: boolean): <T extends CustomElementConstructor>(constructor: T) => T;
export declare function CustomElement(name: string | null | undefined, isExtends?: string | null | boolean): <T extends CustomElementConstructor>(constructor: T) => T;
export declare function CustomElement<T extends CustomElementConstructor>(constructor: T): T;
/** Observes an attribute and assigns the new/initial value on changes. */
export declare function ObserveAttribute<T extends ConvertibleTypes>(name: string | null | undefined, type: T, optional: true): ((target: ICustomElement, key: PropertyKey, descriptor: TypedPropertyDescriptor<ObservedTypeMap[T] | undefined>) => TypedPropertyDescriptor<ObservedTypeMap[T] | undefined>) & ((target: ICustomElement, key: PropertyKey) => void);
export declare function ObserveAttribute<T extends ConvertibleTypes>(name: string | null | undefined, type: T): ((target: ICustomElement, key: PropertyKey, descriptor: TypedPropertyDescriptor<ObservedTypeMap[T]>) => TypedPropertyDescriptor<ObservedTypeMap[T]>) & ((target: ICustomElement, key: PropertyKey) => void);
export declare function ObserveAttribute(name?: string | null): ((target: ICustomElement, key: PropertyKey, descriptor: TypedPropertyDescriptor<string>) => TypedPropertyDescriptor<string>) & ((target: ICustomElement, key: PropertyKey) => void);
/** Make the property reflects to the value of an attribute. */
export declare function ReflectAttribute<T extends ConvertibleTypes>(name?: string | null, type?: T): (target: ICustomElement, key: PropertyKey) => void;
export {};
//# sourceMappingURL=custom-element.d.ts.map