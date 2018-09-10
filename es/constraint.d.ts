import { Expression } from "./expression";
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
export declare enum Operator {
    Le = 0,
    Ge = 1,
    Eq = 2
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
export declare class Constraint {
    constructor(expression: Expression | Variable, operator: Operator, rhs?: Expression | Variable | number, strength?: number);
    /**
     * A static constraint comparison function.
     * @private
     */
    static Compare(a: Constraint, b: Constraint): number;
    /**
     * Returns the unique id number of the constraint.
     * @private
     */
    id(): number;
    /**
     * Returns the expression of the constraint.
     *
     * @return {Expression} expression
     */
    expression(): Expression;
    /**
     * Returns the relational operator of the constraint.
     *
     * @return {Operator} linear constraint operator
     */
    op(): Operator;
    /**
     * Returns the strength of the constraint.
     *
     * @return {Number} strength
     */
    strength(): number;
    toString(): string;
    private _expression;
    private _operator;
    private _strength;
    private _id;
}
