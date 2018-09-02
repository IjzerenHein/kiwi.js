/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/
import { Expression } from "./expression";
import { Strength } from "./strength";
/**
 * An enum defining the linear constraint operators.
 *
 * |Value|Operator|Description|
 * |----|-----|-----|
 * |`Le`|<=|Less than equal|
 * |`Ge`|>=|Greater than equal|
 * |`Eq`|==|Equal|
 *
 * @enum {Number}
 */
export var Operator;
(function (Operator) {
    Operator[Operator["Le"] = 0] = "Le";
    Operator[Operator["Ge"] = 1] = "Ge";
    Operator[Operator["Eq"] = 2] = "Eq";
})(Operator || (Operator = {}));
/**
 * A linear constraint equation.
 *
 * A constraint equation is composed of an expression, an operator,
 * and a strength. The RHS of the equation is implicitly zero.
 *
 * @class
 * @param {Expression} expression The constraint expression (LHS).
 * @param {Operator} operator The equation operator.
 * @param {Expression} [rhs] Right hand side of the expression.
 * @param {Number} [strength=Strength.required] The strength of the constraint.
 */
var Constraint = /** @class */ (function () {
    function Constraint(expression, operator, rhs, strength) {
        if (strength === void 0) { strength = Strength.required; }
        this._id = CnId++;
        this._operator = operator;
        this._strength = Strength.clip(strength);
        if ((rhs === undefined) && (expression instanceof Expression)) {
            this._expression = expression;
        }
        else {
            this._expression = expression.minus(rhs);
        }
    }
    /**
     * A static constraint comparison function.
     * @private
     */
    Constraint.Compare = function (a, b) {
        return a.id() - b.id();
    };
    /**
     * Returns the unique id number of the constraint.
     * @private
     */
    Constraint.prototype.id = function () {
        return this._id;
    };
    /**
     * Returns the expression of the constraint.
     *
     * @return {Expression} expression
     */
    Constraint.prototype.expression = function () {
        return this._expression;
    };
    /**
     * Returns the relational operator of the constraint.
     *
     * @return {Operator} linear constraint operator
     */
    Constraint.prototype.op = function () {
        return this._operator;
    };
    /**
     * Returns the strength of the constraint.
     *
     * @return {Number} strength
     */
    Constraint.prototype.strength = function () {
        return this._strength;
    };
    Constraint.prototype.toString = function () {
        return this._expression.toString() + " " + ["<=", ">=", "="][this._operator] + " 0 (" + this._strength.toString() + ")";
    };
    return Constraint;
}());
export { Constraint };
/**
 * The internal constraint id counter.
 * @private
 */
var CnId = 0;
