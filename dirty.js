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
