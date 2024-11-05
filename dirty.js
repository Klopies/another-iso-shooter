/**
 * this dirty utility makes the javascript Number behave like an array when used like this:
 * @example for (const num of 10) {
 *    // will execute 10 times
 * }
 * this shit is unnecessary, but i like it
 */
export function init() {
  Number.prototype[Symbol.iterator] = function () {
    let currentNum = 0;
    return {
      next: () =>
        currentNum == this
          ? { done: true }
          : {
              value: currentNum++,
              done: false,
            },
    };
  };
}
