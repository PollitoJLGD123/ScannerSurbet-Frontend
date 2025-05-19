import { CookieGetOptions, CookieSetOptions } from 'universal-cookie';

declare module 'react-cookie' {
  export interface Cookies {
    get(name: string, options?: CookieGetOptions): unknown;
    getAll(options?: CookieGetOptions): Record<string, unknown>;
    set(name: string, value: unknown, options?: CookieSetOptions): void;
    remove(name: string, options?: CookieSetOptions): void;
  }
}
