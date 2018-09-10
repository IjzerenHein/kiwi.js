import { IMap } from "./maptype";
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
export declare class Expression {
    constructor(...args: any[]);
    /**
     * Returns the mapping of terms in the expression.
     *
     * This *must* be treated as const.
     * @private
     */
    terms(): IMap<Variable, number>;
    /**
     * Returns the constant of the expression.
     * @private
     */
    constant(): number;
    /**
     * Returns the computed value of the expression.
     *
     * @private
     * @return {Number} computed value of the expression
     */
    value(): number;
    /**
     * Creates a new Expression by adding a number, variable or expression
     * to the expression.
     *
     * @param {Number|Variable|Expression} value Value to add.
     * @return {Expression} expression
     */
    plus(value: number | Variable | Expression): Expression;
    /**
     * Creates a new Expression by substracting a number, variable or expression
     * from the expression.
     *
     * @param {Number|Variable|Expression} value Value to substract.
     * @return {Expression} expression
     */
    minus(value: number | Variable | Expression): Expression;
    /**
     * Creates a new Expression by multiplying with a fixed number.
     *
     * @param {Number} coefficient Coefficient to multiply with.
     * @return {Expression} expression
     */
    multiply(coefficient: number): Expression;
    /**
     * Creates a new Expression by dividing with a fixed number.
     *
     * @param {Number} coefficient Coefficient to divide by.
     * @return {Expression} expression
     */
    divide(coefficient: number): Expression;
    isConstant(): boolean;
    toString(): string;
    private _terms;
    private _constant;
}
