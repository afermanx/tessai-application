import { randomBytes } from 'crypto';

function getRandomString() {
  const array = randomBytes(16);
  return Array.from(array, (byte) => (byte % 36).toString(36)).join('');
}

export function cuid() {
  const prefix = 'c';
  const timeStamp = Date.now().toString(36).slice(-8);
  const random = getRandomString();
  const counter =
    typeof process !== 'undefined' && process.hrtime
      ? process.hrtime()[1].toString(36).slice(-4)
      : Math.floor(performance.now()).toString(36).slice(-4);

  return [prefix, timeStamp, random, counter].join('-');
}
