const symbolMatcher = /^Symbol\((.*)\)$/;

export function resetGlobalRegex(matcher: RegExp) {
  matcher.lastIndex = 0;
  return matcher;
}

export function getSymbolKey(sym: symbol) {
  return sym.toString().replace(symbolMatcher, '$1');
}

export var Bind: MethodDecorator = (target, key, descriptor) => {
  const Type: NewableFunction = target.constructor;
  if(descriptor.get || descriptor.set)
    throw new TypeError(
      `${Type.name}.${key.toString()} ` +
      'has already defined a getter/setter, ' +
      'which is not suppported to use decorator to bind it, ' +
      'consider to manually use Function.bind() in the getter/setter.',
    );
  let orgValue = descriptor.value;
  const { writable, enumerable } = descriptor;
  descriptor.get = function(this: Object) {
    if(this === target) return orgValue;
    const value = typeof orgValue === 'function' ?
      Function.prototype.bind.call(orgValue, this) :
      orgValue;
    for(let o = this; o instanceof Type; o = Object.getPrototypeOf(o))
      if(Object.prototype.hasOwnProperty.call(o, key))
        return value;
    Object.defineProperty(this, key, {
      value, configurable: true, writable, enumerable,
    });
    return value;
  };
  if(writable) {
    descriptor.set = function(this: Object, value: any) {
      if(this === target) return orgValue = value;
      Object.defineProperty(this, key, {
        value, configurable: true, writable: true, enumerable: true,
      });
    };
    delete descriptor.writable;
  }
  delete descriptor.value;
  return descriptor;
};

export type DeepPartial<T> = {
  [P in keyof T]?:
    T[P] extends string | number | boolean | undefined | null | symbol ?
      T[P] :
    T[P] extends Array<infer U> ?
      Array<DeepPartial<U>> :
    T[P] extends ReadonlyArray<infer U> ?
      ReadonlyArray<DeepPartial<U>> :
    DeepPartial<T[P]>;
};

export type KeyOfType<T, TargetType> = keyof {
  [K in keyof T]: T[K] extends TargetType ? T[K] : never;
};

export type DomElement = Element;

export type AssignableProperty<T, K extends keyof T> =
  (<R>() => R extends { [I in K]: T[I] } ? true : false) extends
  (<R>() => R extends { -readonly [I in K]: T[I] } ? true : false) ?
    T[K] extends string | number | boolean | symbol | Function ?
      T[K] :
    AssignableObject<T[K]> :
  never;
type AssignableObject<T> = {
  [K in keyof T]?: AssignableProperty<T, K>;
};

export type AssignableDomElement<T extends HTMLElement> = {
  [K in keyof T]?:
    // Bypass readonly check
    T[K] extends CSSStyleDeclaration | DOMStringMap ?
      AssignableObject<T[K]> :
    AssignableProperty<T, K>;
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