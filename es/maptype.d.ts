import * as tsu from "../thirdparty/tsu";
export interface IMap<T, U> extends tsu.AssociativeArray<T, U> {
}
export declare function createMap<T, U>(compare: tsu.ICompare<T, T>): IMap<T, U>;
