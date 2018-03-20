/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/
namespace kiwi {

    /**
     * @class Strength
     */
    export
    namespace Strength {

        /**
         * Create a new symbolic strength.
         *
         * @param {Number} a strong
         * @param {Number} b medium
         * @param {Number} c weak
         * @param {Number} [w] weight
         * @return {Number} strength
         */
        export
        function create( a: number, b: number, c: number, w: number = 1.0 ) {
            let result: number = 0.0;
            result += Math.max( 0.0, Math.min( 1000.0, a * w ) ) * 1000000.0;
            result += Math.max( 0.0, Math.min( 1000.0, b * w ) ) * 1000.0;
            result += Math.max( 0.0, Math.min( 1000.0, c * w ) );
            return result;
        }

        /**
         * The 'required' symbolic strength.
         */
        export
        let required = create( 1000.0, 1000.0, 1000.0 );

        /**
         * The 'strong' symbolic strength.
         */
        export
        let strong = create( 1.0, 0.0, 0.0 );

        /**
         * The 'medium' symbolic strength.
         */
        export
        let medium = create( 0.0, 1.0, 0.0 );

        /**
         * The 'weak' symbolic strength.
         */
        export
        let weak = create( 0.0, 0.0, 1.0 );

        /**
         * Clip a symbolic strength to the allowed min and max.
         * @private
         */
        export
        function clip( value: number ) {
            return Math.max( 0.0, Math.min( required, value ) );
        }

    }

}
