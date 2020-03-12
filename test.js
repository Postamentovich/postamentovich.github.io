const promisify = require("./promisify");

const _wrap = (fn, cb) => {
  setTimeout(() => {
    cb(fn());
  }, Math.random() * 20);
};

const AsyncArray = function(initial) {
  if (initial && !(initial instanceof Array)) {
    throw new Error("initial value is not an array");
  }

  const a = initial ? Array.from(initial) : [];

  this.set = (index, value, cb) =>
    _wrap(() => {
      a[index] = value;
    }, cb);
  this.push = (value, cb) =>
    _wrap(() => {
      a.push(value);
    }, cb);

  this.get = (index, cb) => _wrap(() => a[index], cb);
  this.pop = cb => _wrap(() => a.pop(), cb);
  this.length = cb => _wrap(() => a.length, cb);

  this.print = () => {
    console.log(a.toString());
  };
};

const add = (a, b, cb) => _wrap(() => a + b, cb);
const subtract = (a, b, cb) => _wrap(() => a - b, cb);
const multiply = (a, b, cb) => _wrap(() => a * b, cb);
const divide = (a, b, cb) => _wrap(() => a / b, cb);
const mod = (a, b, cb) => _wrap(() => a % b, cb);

const less = (a, b, cb) => _wrap(() => a < b, cb);
const equal = (a, b, cb) => _wrap(() => a == b, cb);
const lessOrEqual = (a, b, cb) => _wrap(() => a <= b, cb);
const sqrt = (x, cb) => _wrap(() => Math.sqrt(x), cb);

const array1 = new AsyncArray([-500, 1, 2, 100, 5, 7, 10, 10000]);
const array2 = new AsyncArray([-500, 800, 1, 0, -9]);

const promisifyAdd = promisify(add);
const promisifyLess = promisify(less);
const promisifyEqual = promisify(equal);

/**
 * Функция находит максимальный элемент в массиве.
 * Реализована с помощью async/await.
 *
 * @param {AsyncArray<number>} array - асинхронный массив
 * @param {(result: number | null) => void} cb - callback
 */
async function getMaxValueWithAwait(array, cb) {
  const promisifyLength = promisify(array.length);
  const promisifyGet = promisify(array.get);

  let maxValue = null;

  const length = await promisifyLength();

  /**
   * Проходим по массиву циклом for, и проверяем, меньше
   * текущее максимальное значение чем элемент массива или нет.
   */

  for (
    let i = 0;
    await promisifyLess(i, length);
    i = await promisifyAdd(i, 1)
  ) {
    const item = await promisifyGet(i);
    if (await promisifyEqual(maxValue, null)) maxValue = item;
    else if (await promisifyLess(maxValue, item)) maxValue = item;
  }

  cb(maxValue);
}

/**
 * Функция находит максимальный элемент в массиве.
 * Реализована с помощью Promise.then().
 *
 * @param {AsyncArray<number>} array - асинхронный массив
 * @param {(result: number | null) => void} cb - callback
 */
function getMaxValueWithThen(array, cb) {
  const promisifyPop = promisify(array.pop);

  let maxValue = null;

  /**
   * С помощью рекурсии забираем последний элемент мaссива, и проверяем, меньше
   * текущее максимальное значение чем элемент массива или нет.
   */

  const checkLastElement = () => {
    let lastElement = null;

    promisifyPop()
      /** Получем элемент */
      .then(item => {
        lastElement = item;

        return promisifyEqual(typeof item, "number");
      })
      /** Проверяем есть элемент или нет */
      .then(isExist => {
        if (!isExist) {
          cb(maxValue);
          return Promise.reject("Element don't exist, or not a number");
        }

        return promisifyEqual(maxValue, null);
      })
      /** Проверяем текущее максимально значение на null */
      .then(isNull => {
        if (isNull) {
          maxValue = lastElement;
          checkLastElement();
          return Promise.reject("maxValue is a null");
        }

        return promisifyLess(maxValue, lastElement);
      })
      /** Сравниваем значение элемента и максимальное значение */
      .then(isLess => {
        if (isLess) {
          maxValue = lastElement;
        }

        checkLastElement();
      })
      .catch(e => {
        console.log(e);
      });
  };

  checkLastElement();
}

getMaxValueWithThen(array1, result => console.log(result));

getMaxValueWithAwait(array2, result => console.log(result));
