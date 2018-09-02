/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/
import { createMap } from "./maptype";
import { Variable } from "./variable";
/**
 * An expression of variable terms and a constant.
 *
 * The constructor accepts an arbitrary number of parameters,
 * each of which must be one of the following types:
 *  - number
 *  - Variable
 *  - Expression
 *  - 2-tuple of [number, Variable|Expression]
 *
 * The parameters are summed. The tuples are multiplied.
 *
 * @class
 * @param {...(number|Variable|Expression|Array)} args
 */
var Expression = /** @class */ (function () {
    function Expression() {
        var parsed = parseArgs(arguments);
        this._terms = parsed.terms;
        this._constant = parsed.constant;
    }
    /**
     * Returns the mapping of terms in the expression.
     *
     * This *must* be treated as const.
     * @private
     */
    Expression.prototype.terms = function () {
        return this._terms;
    };
    /**
     * Returns the constant of the expression.
     * @private
     */
    Expression.prototype.constant = function () {
        return this._constant;
    };
    /**
     * Returns the computed value of the expression.
     *
     * @private
     * @return {Number} computed value of the expression
     */
    Expression.prototype.value = function () {
        var result = this._constant;
        for (var i = 0, n = this._terms.size(); i < n; i++) {
            var pair = this._terms.itemAt(i);
            result += pair.first.value() * pair.second;
        }
        return result;
    };
    /**
     * Creates a new Expression by adding a number, variable or expression
     * to the expression.
     *
     * @param {Number|Variable|Expression} value Value to add.
     * @return {Expression} expression
     */
    Expression.prototype.plus = function (value) {
        return new Expression(this, value);
    };
    /**
     * Creates a new Expression by substracting a number, variable or expression
     * from the expression.
     *
     * @param {Number|Variable|Expression} value Value to substract.
     * @return {Expression} expression
     */
    Expression.prototype.minus = function (value) {
        return new Expression(this, typeof value === "number" ? -value : [-1, value]);
    };
    /**
     * Creates a new Expression by multiplying with a fixed number.
     *
     * @param {Number} coefficient Coefficient to multiply with.
     * @return {Expression} expression
     */
    Expression.prototype.multiply = function (coefficient) {
        return new Expression([coefficient, this]);
    };
    /**
     * Creates a new Expression by dividing with a fixed number.
     *
     * @param {Number} coefficient Coefficient to divide by.
     * @return {Expression} expression
     */
    Expression.prototype.divide = function (coefficient) {
        return new Expression([1 / coefficient, this]);
    };
    Expression.prototype.isConstant = function () {
        return this._terms.size() == 0;
    };
    Expression.prototype.toString = function () {
        var result = this._terms.array.map(function (pair, idx) {
            return (pair.second + "*" + pair.first.toString());
        }).join(" + ");
        if (!this.isConstant() && this._constant !== 0) {
            result += " + ";
        }
        result += this._constant;
        return result;
    };
    return Expression;
}());
export { Expression };
/**
 * An internal argument parsing function.
 * @private
 */
function parseArgs(args) {
    var constant = 0.0;
    var factory = function () { return 0.0; };
    var terms = createMap(Variable.Compare);
    for (var i = 0, n = args.length; i < n; ++i) {
        var item = args[i];
        if (typeof item === "number") {
            constant += item;
        }
        else if (item instanceof Variable) {
            terms.setDefault(item, factory).second += 1.0;
        }
        else if (item instanceof Expression) {
            constant += item.constant();
            var terms2 = item.terms();
            for (var j = 0, k = terms2.size(); j < k; j++) {
                var termPair = terms2.itemAt(j);
                terms.setDefault(termPair.first, factory).second += termPair.second;
            }
        }
        else if (item instanceof Array) {
            if (item.length !== 2) {
                throw new Error("array must have length 2");
            }
            var value = item[0];
            var value2 = item[1];
            if (typeof value !== "number") {
                throw new Error("array item 0 must be a number");
            }
            if (value2 instanceof Variable) {
                terms.setDefault(value2, factory).second += value;
            }
            else if (value2 instanceof Expression) {
                constant += (value2.constant() * value);
                var terms2 = value2.terms();
                for (var j = 0, k = terms2.size(); j < k; j++) {
                    var termPair = terms2.itemAt(j);
                    terms.setDefault(termPair.first, factory).second += (termPair.second * value);
                }
            }
            else {
                throw new Error("array item 1 must be a variable or expression");
            }
        }
        else {
            throw new Error("invalid Expression argument: " + item);
        }
    }
    return { terms: terms, constant: constant };
}
