/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/
import * as tsu from "../thirdparty/tsu";
export function createMap(compare) {
    return new tsu.AssociativeArray(compare);
}
