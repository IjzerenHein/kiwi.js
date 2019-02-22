/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/

import { Expression } from "./expression";
import { Strength } from "./strength";
import { Variable } from "./variable";

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
export
enum Operator {
    Le,  // <=
    Ge,  // >=
    Eq,   // ==
}

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
export
class Constraint {
    constructor(
        expression: Expression|Variable,
        operator: Operator,
        rhs?: Expression|Variable|number,
        strength: number = Strength.required) {
        this._operator = operator;
        this._strength = Strength.clip(strength);
        if ((rhs === undefined) && (expression instanceof Expression)) {
            this._expression = expression;
        } else {
            this._expression = expression.minus(rhs);
        }
    }

    /**
     * Returns the unique id number of the constraint.
     * @private
     */
    public id(): number {
        return this._id;
    }

    /**
     * Returns the expression of the constraint.
     *
     * @return {Expression} expression
     */
    public expression(): Expression {
        return this._expression;
    }

    /**
     * Returns the relational operator of the constraint.
     *
     * @return {Operator} linear constraint operator
     */
    public op(): Operator {
        return this._operator;
    }

    /**
     * Returns the strength of the constraint.
     *
     * @return {Number} strength
     */
    public strength(): number {
        return this._strength;
    }

    public toString(): string {
        return this._expression.toString() + " " + ["<=", ">=", "="][this._operator] + " 0 (" + this._strength.toString() + ")";
    }

    private _expression: Expression;
    private _operator: Operator;
    private _strength: number;
    private _id: number = CnId++;
}

/**
 * The internal constraint id counter.
 * @private
 */
let CnId = 0;
