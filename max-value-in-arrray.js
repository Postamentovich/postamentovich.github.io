const {
  AsyncArray,
  add,
  subtract,
  multiply,
  divide,
  mod,
  less,
  equal,
  lessOrEqual,
  sqrt
} = Homework;

/**
 * Промисификация функций с callback
 * @param {func} f
 * @returns {() => Promise}
 */
function promisify(f) {
  return function(...args) {
    return new Promise(resolve => {
      function callback(result) {
        resolve(result);
      }
      args.push(callback);
      f.call(this, ...args);
    });
  };
}

const promisifyAdd = promisify(add);
const promisifyLess = promisify(less);
const promisifyEqual = promisify(equal);

console.log("Вариант 1");

const array1 = new AsyncArray([-500, 1, 2, 100, 5, 7, 10, 10000]);
console.log("Создаем новый асинхронный массив:");
array1.print();

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

  console.log(`Получем длину массива --> ${length}`);

  /**
   * Проходим по массиву циклом for, и проверяем, меньше
   * текущее максимальное значение чем элемент массива или нет.
   */

  console.log("Проходим по массиву через цикл for");
  for (
    let i = 0;
    await promisifyLess(i, length);
    i = await promisifyAdd(i, 1)
  ) {
    const item = await promisifyGet(i);
    console.log(`Значение элемента под индексом ${i} ---> ${item}`);
    if (await promisifyEqual(maxValue, null)) {
        
      maxValue = item;
    } else if (await promisifyLess(maxValue, item)) maxValue = item;
  }

  cb(maxValue);
}

const array2 = new AsyncArray([-900, 800, 1, 0, -9]);

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
