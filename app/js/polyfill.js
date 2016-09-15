/**
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from
 * will emulate array.from behaviour
 * which is not yet supported on IE browsers
 */

// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
    Array.from = (function () {
        var toStr = Object.prototype.toString;
        var isCallable = function (fn) {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function (value) {
            var number = Number(value);
            if (isNaN(number)) { return 0; }
            if (number === 0 || !isFinite(number)) { return number; }
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function (value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        // The length property of the from method is 1.
        return function from(arrayLike/*, mapFn, thisArg */) {
            // 1. Let C be the this value.
            var C = this;

            // 2. Let items be ToObject(arrayLike).
            var items = Object(arrayLike);

            // 3. ReturnIfAbrupt(items).
            if (arrayLike == null) {
                throw new TypeError("Array.from requires an array-like object - not null or undefined");
            }

            // 4. If mapfn is undefined, then let mapping be false.
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;
            if (typeof mapFn !== 'undefined') {
                // 5. else
                // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                if (!isCallable(mapFn)) {
                    throw new TypeError('Array.from: when provided, the second argument must be a function');
                }

                // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }

            // 10. Let lenValue be Get(items, "length").
            // 11. Let len be ToLength(lenValue).
            var len = toLength(items.length);

            // 13. If IsConstructor(C) is true, then
            // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
            // 14. a. Else, Let A be ArrayCreate(len).
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);

            // 16. Let k be 0.
            var k = 0;
            // 17. Repeat, while k < len… (also steps a - h)
            var kValue;
            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                } else {
                    A[k] = kValue;
                }
                k += 1;
            }
            // 18. Let putStatus be Put(A, "length", len, true).
            A.length = len;
            // 20. Return A.
            return A;
        };
    }());
}
/**
 * support for childnode.remove() in iE
 */
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

/**
 * Array.forEach support
 */
// ECMA-262, Edition 5, 15.4.4.18
// Référence: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function(callback, thisArg) {

        var T, k;

        if (this === null) {
            throw new TypeError(' this vaut null ou n est pas défini');
        }

        // 1. Soit O le résultat de l'appel à ToObject
        //    auquel on a passé |this| en argument.
        var O = Object(this);

        // 2. Soit lenValue le résultat de l'appel de la méthode
        //    interne Get sur O avec l'argument "length".
        // 3. Soit len la valeur ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. Si IsCallable(callback) est false, on lève une TypeError.
        // Voir : http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + ' n est pas une fonction');
        }

        // 5. Si thisArg a été fourni, soit T ce thisArg ;
        //    sinon soit T égal à undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Soit k égal à 0
        k = 0;

        // 7. On répète tant que k < len
        while (k < len) {

            var kValue;

            // a. Soit Pk égal ToString(k).
            //   (implicite pour l'opérande gauche de in)
            // b. Soit kPresent le résultat de l'appel de la
            //    méthode interne HasProperty de O avec l'argument Pk.
            //    Cette étape peut être combinée avec c
            // c. Si kPresent vaut true, alors
            if (k in O) {

                // i. Soit kValue le résultat de l'appel de la
                //    méthode interne Get de O avec l'argument Pk.
                kValue = O[k];

                // ii. On appelle la méthode interne Call de callback
                //     avec T comme valeur this et la liste des arguments
                //     qui contient kValue, k, et O.
                callback.call(T, kValue, k, O);
            }
            // d. On augmente k de 1.
            k++;
        }
        // 8. on renvoie undefined
    };
}