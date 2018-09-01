/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/

export interface IMap<T extends { id(): number }, U> extends IndexedMap<T, U> { }

export
function createMap<T extends { id() : number }, U>( compare: any ): IMap<T, U> {
    return new IndexedMap<T, U>();
}

class IndexedMap<T extends { id() : number }, U> {
    public _index = {} as { [ id : number ] : number | undefined };
    public _array = [] as Pair<T, U>[];
    
    /**
     * Returns the number of items in the array.
     */
    public size(): number {
        return this._array.length;
    }

    /**
    * Returns true if the array is empty.
    */
    public empty(): boolean {
        return this._array.length === 0;
    }
    
    /**
     * Returns the item at the given array index.
     *
     * @param index The integer index of the desired item.
     */
    public itemAt(index: number): Pair<T, U> {
        return this._array[index];
    }

    /**
    * Returns true if the key is in the array, false otherwise.
    *
    * @param key The key to locate in the array.
    */
    public contains(key: T) {
        return this._index[key.id()] !== undefined;
    }

    /**
     * Returns the pair associated with the given key, or undefined.
     *
     * @param key The key to locate in the array.
     */
    public find(key: T) {
        const i = this._index[key.id()];
        return i === undefined ? undefined : this._array[i];
    }

    /**
     * Returns the pair associated with the key if it exists.
     *
     * If the key does not exist, a new pair will be created and
     * inserted using the value created by the given factory.
     *
     * @param key The key to locate in the array.
     * @param factory The function which creates the default value.
     */
    public setDefault(key: T, factory: () => U): Pair<T, U> {
        const i = this._index[key.id()];
        if (i === undefined) {
            const pair = new Pair(key, factory());
            this._index[key.id()] = this._array.length;
            this._array.push(pair);
            return pair;
        } else {
            return this._array[i];
        }
    }

    /**
     * Insert the pair into the array and return the pair.
     *
     * This will overwrite any existing entry in the array.
     *
     * @param key The key portion of the pair.
     * @param value The value portion of the pair.
     */
    public insert(key: T, value: U): Pair<T, U> {
        const pair = new Pair(key, value),
            i = this._index[key.id()];
        if (i === undefined) {
            this._index[key.id()] = this._array.length;
            this._array.push(pair);
        } else {
            this._array[i] = pair;
        }
        return pair;
    }

    /**
     * Removes and returns the pair for the given key, or undefined.
     *
     * @param key The key to remove from the map.
     */
    public erase(key: T): Pair<T, U> {
        const i = this._index[key.id()];
        if (i === undefined) return undefined;
        this._index[key.id()] = undefined;
        const pair = this._array[i],
            last = this._array.pop();
        if (pair !== last) {
            this._array[i] = last;
            this._index[last.first.id()] = i;
        }
        return pair;
    }

    /**
     * Create a copy of this associative array.
     */
    public copy(): IndexedMap<T, U> {
        const copy = new IndexedMap<T, U>();
        copy._index = { ...this._index };
        copy._array = this._array.map(p => p.copy());
        return copy;
    }
}

/**
* A class which defines a generic pair object.
*/
class Pair<T, U> {
    /**
    * Construct a new Pair object.
    *
    * @param first The first item of the pair.
    * @param second The second item of the pair.
    */
    constructor(public first: T, public second: U) { }

    /**
    * Create a copy of the pair.
    */
    public copy() { return new Pair(this.first, this.second); }
}
