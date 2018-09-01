import { Expression } from "./expression";
/**
 * The primary user constraint variable.
 *
 * @class
 * @param {String} [name=""] The name to associated with the variable.
 */
export declare class Variable {
    constructor(name?: string);
    /**
     * A static variable comparison function.
     * @private
     */
    static Compare(a: Variable, b: Variable): number;
    /**
     * Returns the unique id number of the variable.
     * @private
     */
    id(): number;
    /**
     * Returns the name of the variable.
     *
     * @return {String} name of the variable
     */
    name(): string;
    /**
     * Set the name of the variable.
     *
     * @param {String} name Name of the variable
     */
    setName(name: string): void;
    /**
     * Returns the user context object of the variable.
     * @private
     */
    context(): any;
    /**
     * Set the user context object of the variable.
     * @private
     */
    setContext(context: any): void;
    /**
     * Returns the value of the variable.
     *
     * @return {Number} Calculated value
     */
    value(): number;
    /**
     * Set the value of the variable.
     * @private
     */
    setValue(value: number): void;
    /**
     * Creates a new Expression by adding a number, variable or expression
     * to the variable.
     *
     * @param {Number|Variable|Expression} value Value to add.
     * @return {Expression} expression
     */
    plus(value: number | Variable | Expression): Expression;
    /**
     * Creates a new Expression by substracting a number, variable or expression
     * from the variable.
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
    /**
     * Returns the JSON representation of the variable.
     * @private
     */
    toJSON(): any;
    toString(): string;
    private _name;
    private _value;
    private _context;
    private _id;
}
