/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/
import { Expression } from "./expression";
/**
 * The primary user constraint variable.
 *
 * @class
 * @param {String} [name=""] The name to associated with the variable.
 */
var Variable = /** @class */ (function () {
    function Variable(name) {
        if (name === void 0) { name = ""; }
        this._value = 0.0;
        this._context = null;
        this._id = VarId++;
        this._name = name;
    }
    /**
     * A static variable comparison function.
     * @private
     */
    Variable.Compare = function (a, b) {
        return a.id() - b.id();
    };
    /**
     * Returns the unique id number of the variable.
     * @private
     */
    Variable.prototype.id = function () {
        return this._id;
    };
    /**
     * Returns the name of the variable.
     *
     * @return {String} name of the variable
     */
    Variable.prototype.name = function () {
        return this._name;
    };
    /**
     * Set the name of the variable.
     *
     * @param {String} name Name of the variable
     */
    Variable.prototype.setName = function (name) {
        this._name = name;
    };
    /**
     * Returns the user context object of the variable.
     * @private
     */
    Variable.prototype.context = function () {
        return this._context;
    };
    /**
     * Set the user context object of the variable.
     * @private
     */
    Variable.prototype.setContext = function (context) {
        this._context = context;
    };
    /**
     * Returns the value of the variable.
     *
     * @return {Number} Calculated value
     */
    Variable.prototype.value = function () {
        return this._value;
    };
    /**
     * Set the value of the variable.
     * @private
     */
    Variable.prototype.setValue = function (value) {
        this._value = value;
    };
    /**
     * Creates a new Expression by adding a number, variable or expression
     * to the variable.
     *
     * @param {Number|Variable|Expression} value Value to add.
     * @return {Expression} expression
     */
    Variable.prototype.plus = function (value) {
        return new Expression(this, value);
    };
    /**
     * Creates a new Expression by substracting a number, variable or expression
     * from the variable.
     *
     * @param {Number|Variable|Expression} value Value to substract.
     * @return {Expression} expression
     */
    Variable.prototype.minus = function (value) {
        return new Expression(this, typeof value === "number" ? -value : [-1, value]);
    };
    /**
     * Creates a new Expression by multiplying with a fixed number.
     *
     * @param {Number} coefficient Coefficient to multiply with.
     * @return {Expression} expression
     */
    Variable.prototype.multiply = function (coefficient) {
        return new Expression([coefficient, this]);
    };
    /**
     * Creates a new Expression by dividing with a fixed number.
     *
     * @param {Number} coefficient Coefficient to divide by.
     * @return {Expression} expression
     */
    Variable.prototype.divide = function (coefficient) {
        return new Expression([1 / coefficient, this]);
    };
    /**
     * Returns the JSON representation of the variable.
     * @private
     */
    Variable.prototype.toJSON = function () {
        return {
            name: this._name,
            value: this._value,
        };
    };
    Variable.prototype.toString = function () {
        return this._context + "[" + this._name + ":" + this._value + "]";
    };
    return Variable;
}());
export { Variable };
/**
 * The internal variable id counter.
 * @private
 */
var VarId = 0;
