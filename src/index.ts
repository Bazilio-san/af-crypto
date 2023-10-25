import * as crypto from 'crypto';
import { BinaryLike, Encoding } from 'crypto';
import { h64, h32 } from 'xxhashjs';
import { v5 } from 'uuid';

/**
 * Returns a random string of 13 digits
 * Ex: 7772487018632
 */
export const getRnd = (): string => Math.random()
  .toString()
  .slice(2, 11) + Math.random()
  .toString()
  .slice(2, 6);

/**
 * Возвращает MD5 хеш данных.
 * Ex: de822b6217846bfa1dcf30b701086929
 */
export const md5 = (data: string | BinaryLike, options?: { inputEncoding?: Encoding }): string => (options?.inputEncoding
  ? crypto.createHash('md5').update(data as string, options?.inputEncoding).digest('hex')
  : crypto.createHash('md5').update(data as BinaryLike).digest('hex'));

/**
 * Возвращает хеш данных в виде UID.
 * Ex: 622B82DE-8417-FA6B-1DCF-30B701086929
 */
export const md5UID = (data: string | BinaryLike, options?: { inputEncoding?: Encoding }): string => {
  const x = md5(data, options);

  return `${x.substring(6, 8)
  + x.substring(4, 6)
  + x.substring(2, 4)
  + x.substring(0, 2)
  }-${x.substring(10, 12)
  }${x.substring(8, 10)
  }-${x.substring(14, 16)
  }${x.substring(12, 14)
  }-${x.substring(16, 20)
  }-${x.substring(20, 32)}`.toUpperCase();
};

// Ex: 7c93cb01f21061ade3be5ac66b449fef
export const simpleRandomHash = (): string => md5(String(Date.now() + Math.random()));

// Ex: 7B9EE256-EFC6-90A0-8423-6E29C0EC872C
export const simpleRandomUid = (): string => md5UID(String(Date.now() + Math.random()));

const isObject = (v: any) => v != null
  && typeof v === 'object'
  && !Array.isArray(v)
  && !(v instanceof Date)
  && !(v instanceof Set)
  && !(v instanceof Map);

const defaultSeed = 0xCAFEBABE;

export const xxHash = (data: any, base: '32' | '64' | 32 | 64 = 32, seed = defaultSeed): string => {
  let stringToHash = '';
  if (data === undefined) {
    stringToHash = '#thisisundefined#';
  } else if (data === null) {
    stringToHash = '#thisisnull#';
  } else if (data === '') {
    stringToHash = '#thisisemptystring#';
  } else if (Array.isArray(data)) {
    const arr = data.map((value) => ([value, xxHash(String(value) + (typeof value), 32, seed)]));
    arr.sort(([, a], [, b]) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    stringToHash = JSON.stringify(arr.map(([v]) => v));
  } else if (isObject(data)) {
    const op = Object.prototype.toString.call(data); // === '[object Date]'
    switch (op) {
      case '[object Function]':
      case '[object Date]':
        stringToHash += data.toString();
        break;
      // case '[object Object]':
      default: {
        const keys = Object.keys(data)
          .sort();
        keys.forEach((key) => {
          stringToHash += key + xxHash(data[key], base, seed);
        });
      }
    }
  } else if (typeof data === 'string') {
    stringToHash = data;
  } else if (typeof data === 'number') {
    stringToHash = `i${String(data)}`;
  } else if (typeof data === 'boolean') {
    stringToHash = `b${data ? 1 : 0}`;
  } else if (typeof data === 'function') {
    stringToHash = `f${data.toString()}`;
  }

  return (String(base) === '64' ? h64 : h32)(stringToHash, seed).toString(16);
};

// Ex: 84818f3b
export const xxHash32 = (data: any, seed: number = defaultSeed): string => xxHash(data, 32, seed);

// Ex: 84818f3b
export const shortHash = (data: any, seed: number = defaultSeed): string => xxHash(data, 32, seed);

// Ex: 3234bdb6902d2f2f
export const xxHash64 = (data: any, seed: number = defaultSeed): string => xxHash(data, 64, seed);

/**
 * Возвращает UUID для переданных данных
 * Ex: 3b414d9a-e979-55de-aa56-0bf6392a88aa
 */
export const getUID = (data: any): string => v5(xxHash64(data), '7D51C591-6202-4372-85F2-DF407E734B04');
