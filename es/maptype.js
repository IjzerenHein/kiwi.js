/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/
export function createMap(compare) {
    return new IndexedMap();
}
var IndexedMap = /** @class */ (function () {
    function IndexedMap() {
        this.index = {};
        this.array = [];
    }
    /**
     * Returns the number of items in the array.
     */
    IndexedMap.prototype.size = function () {
        return this.array.length;
    };
    /**
     * Returns true if the array is empty.
     */
    IndexedMap.prototype.empty = function () {
        return this.array.length === 0;
    };
    /**
     * Returns the item at the given array index.
     *
     * @param index The integer index of the desired item.
     */
    IndexedMap.prototype.itemAt = function (index) {
        return this.array[index];
    };
    /**
     * Returns true if the key is in the array, false otherwise.
     *
     * @param key The key to locate in the array.
     */
    IndexedMap.prototype.contains = function (key) {
        return this.index[key.id()] !== undefined;
    };
    /**
     * Returns the pair associated with the given key, or undefined.
     *
     * @param key The key to locate in the array.
     */
    IndexedMap.prototype.find = function (key) {
        var i = this.index[key.id()];
        return i === undefined ? undefined : this.array[i];
    };
    /**
     * Returns the pair associated with the key if it exists.
     *
     * If the key does not exist, a new pair will be created and
     * inserted using the value created by the given factory.
     *
     * @param key The key to locate in the array.
     * @param factory The function which creates the default value.
     */
    IndexedMap.prototype.setDefault = function (key, factory) {
        var i = this.index[key.id()];
        if (i === undefined) {
            var pair = new Pair(key, factory());
            this.index[key.id()] = this.array.length;
            this.array.push(pair);
            return pair;
        }
        else {
            return this.array[i];
        }
    };
    /**
     * Insert the pair into the array and return the pair.
     *
     * This will overwrite any existing entry in the array.
     *
     * @param key The key portion of the pair.
     * @param value The value portion of the pair.
     */
    IndexedMap.prototype.insert = function (key, value) {
        var pair = new Pair(key, value);
        var i = this.index[key.id()];
        if (i === undefined) {
            this.index[key.id()] = this.array.length;
            this.array.push(pair);
        }
        else {
            this.array[i] = pair;
        }
        return pair;
    };
    /**
     * Removes and returns the pair for the given key, or undefined.
     *
     * @param key The key to remove from the map.
     */
    IndexedMap.prototype.erase = function (key) {
        var i = this.index[key.id()];
        if (i === undefined) {
            return undefined;
        }
        this.index[key.id()] = undefined;
        var pair = this.array[i];
        var last = this.array.pop();
        if (pair !== last) {
            this.array[i] = last;
            this.index[last.first.id()] = i;
        }
        return pair;
    };
    /**
     * Create a copy of this associative array.
     */
    IndexedMap.prototype.copy = function () {
        var copy = new IndexedMap();
        for (var i = 0; i < this.array.length; i++) {
            var pair = this.array[i].copy();
            copy.array[i] = pair;
            copy.index[pair.first.id()] = i;
        }
        return copy;
    };
    return IndexedMap;
}());
/**
 * A class which defines a generic pair object.
 * @private
 */
// tslint:disable: max-classes-per-file
var Pair = /** @class */ (function () {
    /**
     * Construct a new Pair object.
     *
     * @param first The first item of the pair.
     * @param second The second item of the pair.
     */
    function Pair(first, second) {
        this.first = first;
        this.second = second;
    }
    /**
     * Create a copy of the pair.
     */
    Pair.prototype.copy = function () { return new Pair(this.first, this.second); };
    return Pair;
}());
