import { uglify } from 'rollup-plugin-uglify';

const license = `
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2018, Nucleic Development Team & H. Rutjes.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
-----------------------------------------------------------------------------*/
`,
    banner = license + `
/**
 * Kiwi is an efficient implementation of the Cassowary constraint solving
 * algorithm, based on the seminal Cassowary paper.
 * It is *not* a refactoring or port of the original C++ solver, but
 * has been designed from the ground up to be lightweight and fast.
 *
 * **Example**
 *
 * \`\`\`javascript
 * var kiwi = require('kiwi');
 *
 * // Create a solver
 * var solver = new kiwi.Solver();
 *
 * // Create and add some editable variables
 * var left = new kiwi.Variable();
 * var width = new kiwi.Variable();
 * solver.addEditVariable(left, kiwi.Strength.strong);
 * solver.addEditVariable(width, kiwi.Strength.strong);
 *
 * // Create a variable calculated through a constraint
 * var centerX = new kiwi.Variable();
 * var expr = new kiwi.Expression([-1, centerX], left, [0.5, width]);
 * solver.addConstraint(new kiwi.Constraint(expr, kiwi.Operator.Eq, kiwi.Strength.required));
 *
 * // Suggest some values to the solver
 * solver.suggestValue(left, 0);
 * solver.suggestValue(width, 500);
 *
 * // Lets solve the problem!
 * solver.updateVariables();
 * assert(centerX.value(), 250);
 * \`\`\`
 *
 * ## API Documentation
 * @module kiwi
 */
`;

// we generate three output formats:
// - UMD in lib/kiwi.js
// - minified UMD in lib/kiwi.min.js
// - a fully ES6 version in tmp/kiwi.js, used just as the input to jsdoc2md, as we have 
//   Typescript set to down-compile the others to ES5 for max compatibility, but 
//   Typescript's ES5-polyfills confuse jsdoc2md.

const umd = {
        input: 'es/kiwi.js',
        output: {
            file: 'lib/kiwi.js',
            format: 'umd',
            name: 'kiwi',
            exports: 'named',
            banner
        }
    },
    minified = {
        ...umd,
        output: {
            ...umd.output,
            file: 'lib/kiwi.min.js'
        },
        plugins: [ 
            uglify({
                output: {
                    preamble: license
                }
            }) 
        ]
    },
    doc = {
        input: 'tmp/es/kiwi.js',
        output: {
            ...umd.output,
            file: 'tmp/kiwi.js',
            format: 'es'
        }
    };

export default [ umd, minified, doc ];