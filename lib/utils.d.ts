export declare function resetGlobalRegex(matcher: RegExp): RegExp;
export declare function getSymbolKey(sym: symbol): string;
export declare var Bind: MethodDecorator;
export declare type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends string | number | boolean | undefined | null | symbol ? T[P] : T[P] extends Array<infer U> ? Array<DeepPartial<U>> : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : DeepPartial<T[P]>;
};
export declare type KeyOfType<T, TargetType> = keyof {
    [K in keyof T]: T[K] extends TargetType ? T[K] : never;
};
export declare type DomElement = Element;
export declare type AssignableProperty<T, K extends keyof T> = (<R>() => R extends {
    [I in K]: T[I];
} ? true : false) extends (<R>() => R extends {
    -readonly [I in K]: T[I];
} ? true : false) ? T[K] extends string | number | boolean | symbol | Function ? T[K] : AssignableObject<T[K]> : never;
declare type AssignableObject<T> = {
    [K in keyof T]?: AssignableProperty<T, K>;
};
export declare type AssignableDomElement<T extends HTMLElement> = {
    [K in keyof T]?: T[K] extends CSSStyleDeclaration | DOMStringMap ? AssignableObject<T[K]> : AssignableProperty<T, K>;
} & {
    [attribute: string]: any;
};
export interface TypeMap {
    undefined: undefined;
    string: string;
    boolean: boolean;
    number: number;
    bigint: bigint;
    symbol: symbol;
    'function': Function;
    object: object | null;
}
export {};
//# sourceMappingURL=utils.d.ts.map