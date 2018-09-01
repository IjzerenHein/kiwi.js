export interface IMap<T extends {
    id(): number;
}, U> extends IndexedMap<T, U> {
}
export declare function createMap<T extends {
    id(): number;
}, U>(compare: any): IMap<T, U>;
declare class IndexedMap<T extends {
    id(): number;
}, U> {
    _index: {
        [id: number]: number;
    };
    _array: Pair<T, U>[];
    /**
     * Returns the number of items in the array.
     */
    size(): number;
    /**
    * Returns true if the array is empty.
    */
    empty(): boolean;
    /**
     * Returns the item at the given array index.
     *
     * @param index The integer index of the desired item.
     */
    itemAt(index: number): Pair<T, U>;
    /**
    * Returns true if the key is in the array, false otherwise.
    *
    * @param key The key to locate in the array.
    */
    contains(key: T): boolean;
    /**
     * Returns the pair associated with the given key, or undefined.
     *
     * @param key The key to locate in the array.
     */
    find(key: T): Pair<T, U>;
    /**
     * Returns the pair associated with the key if it exists.
     *
     * If the key does not exist, a new pair will be created and
     * inserted using the value created by the given factory.
     *
     * @param key The key to locate in the array.
     * @param factory The function which creates the default value.
     */
    setDefault(key: T, factory: () => U): Pair<T, U>;
    /**
     * Insert the pair into the array and return the pair.
     *
     * This will overwrite any existing entry in the array.
     *
     * @param key The key portion of the pair.
     * @param value The value portion of the pair.
     */
    insert(key: T, value: U): Pair<T, U>;
    /**
     * Removes and returns the pair for the given key, or undefined.
     *
     * @param key The key to remove from the map.
     */
    erase(key: T): Pair<T, U>;
    /**
     * Create a copy of this associative array.
     */
    copy(): IndexedMap<T, U>;
}
/**
* A class which defines a generic pair object.
*/
declare class Pair<T, U> {
    first: T;
    second: U;
    /**
    * Construct a new Pair object.
    *
    * @param first The first item of the pair.
    * @param second The second item of the pair.
    */
    constructor(first: T, second: U);
    /**
    * Create a copy of the pair.
    */
    copy(): Pair<T, U>;
}
export {};
