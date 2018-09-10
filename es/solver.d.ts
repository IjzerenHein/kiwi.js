import { Constraint, Operator } from "./constraint";
import { Expression } from "./expression";
import { Variable } from "./variable";
/**
 * The constraint solver class.
 *
 * @class
 */
export declare class Solver {
    /**
     * Construct a new Solver.
     */
    constructor();
    /**
     * Creates and add a constraint to the solver.
     *
     * @param {Expression|Variable} lhs Left hand side of the expression
     * @param {Operator} operator Operator
     * @param {Expression|Variable|Number} rhs Right hand side of the expression
     * @param {Number} [strength=Strength.required] Strength
     */
    createConstraint(lhs: Expression | Variable, operator: Operator, rhs: Expression | Variable | number, strength?: number): Constraint;
    /**
     * Add a constraint to the solver.
     *
     * @param {Constraint} constraint Constraint to add to the solver
     */
    addConstraint(constraint: Constraint): void;
    /**
     * Remove a constraint from the solver.
     *
     * @param {Constraint} constraint Constraint to remove from the solver
     */
    removeConstraint(constraint: Constraint): void;
    /**
     * Test whether the solver contains the constraint.
     *
     * @param {Constraint} constraint Constraint to test for
     * @return {Bool} true or false
     */
    hasConstraint(constraint: Constraint): boolean;
    /**
     * Add an edit variable to the solver.
     *
     * @param {Variable} variable Edit variable to add to the solver
     * @param {Number} strength Strength, should be less than `Strength.required`
     */
    addEditVariable(variable: Variable, strength: number): void;
    /**
     * Remove an edit variable from the solver.
     *
     * @param {Variable} variable Edit variable to remove from the solver
     */
    removeEditVariable(variable: Variable): void;
    /**
     * Test whether the solver contains the edit variable.
     *
     * @param {Variable} variable Edit variable to test for
     * @return {Bool} true or false
     */
    hasEditVariable(variable: Variable): boolean;
    /**
     * Suggest the value of an edit variable.
     *
     * @param {Variable} variable Edit variable to suggest a value for
     * @param {Number} value Suggested value
     */
    suggestValue(variable: Variable, value: number): void;
    /**
     * Update the values of the variables.
     */
    updateVariables(): void;
    /**
     * Get the symbol for the given variable.
     *
     * If a symbol does not exist for the variable, one will be created.
     * @private
     */
    private _getVarSymbol;
    /**
     * Create a new Row object for the given constraint.
     *
     * The terms in the constraint will be converted to cells in the row.
     * Any term in the constraint with a coefficient of zero is ignored.
     * This method uses the `_getVarSymbol` method to get the symbol for
     * the variables added to the row. If the symbol for a given cell
     * variable is basic, the cell variable will be substituted with the
     * basic row.
     *
     * The necessary slack and error variables will be added to the row.
     * If the constant for the row is negative, the sign for the row
     * will be inverted so the constant becomes positive.
     *
     * Returns the created Row and the tag for tracking the constraint.
     * @private
     */
    private _createRow;
    /**
     * Choose the subject for solving for the row.
     *
     * This method will choose the best subject for using as the solve
     * target for the row. An invalid symbol will be returned if there
     * is no valid target.
     *
     * The symbols are chosen according to the following precedence:
     *
     * 1) The first symbol representing an external variable.
     * 2) A negative slack or error tag variable.
     *
     * If a subject cannot be found, an invalid symbol will be returned.
     *
     * @private
     */
    private _chooseSubject;
    /**
     * Add the row to the tableau using an artificial variable.
     *
     * This will return false if the constraint cannot be satisfied.
     *
     * @private
     */
    private _addWithArtificialVariable;
    /**
     * Substitute the parametric symbol with the given row.
     *
     * This method will substitute all instances of the parametric symbol
     * in the tableau and the objective function with the given row.
     *
     * @private
     */
    private _substitute;
    /**
     * Optimize the system for the given objective function.
     *
     * This method performs iterations of Phase 2 of the simplex method
     * until the objective function reaches a minimum.
     *
     * @private
     */
    private _optimize;
    /**
     * Optimize the system using the dual of the simplex method.
     *
     * The current state of the system should be such that the objective
     * function is optimal, but not feasible. This method will perform
     * an iteration of the dual simplex method to make the solution both
     * optimal and feasible.
     *
     * @private
     */
    private _dualOptimize;
    /**
     * Compute the entering variable for a pivot operation.
     *
     * This method will return first symbol in the objective function which
     * is non-dummy and has a coefficient less than zero. If no symbol meets
     * the criteria, it means the objective function is at a minimum, and an
     * invalid symbol is returned.
     *
     * @private
     */
    private _getEnteringSymbol;
    /**
     * Compute the entering symbol for the dual optimize operation.
     *
     * This method will return the symbol in the row which has a positive
     * coefficient and yields the minimum ratio for its respective symbol
     * in the objective function. The provided row *must* be infeasible.
     * If no symbol is found which meats the criteria, an invalid symbol
     * is returned.
     *
     * @private
     */
    private _getDualEnteringSymbol;
    /**
     * Compute the symbol for pivot exit row.
     *
     * This method will return the symbol for the exit row in the row
     * map. If no appropriate exit symbol is found, an invalid symbol
     * will be returned. This indicates that the objective function is
     * unbounded.
     *
     * @private
     */
    private _getLeavingSymbol;
    /**
     * Compute the leaving symbol for a marker variable.
     *
     * This method will return a symbol corresponding to a basic row
     * which holds the given marker variable. The row will be chosen
     * according to the following precedence:
     *
     * 1) The row with a restricted basic varible and a negative coefficient
     *    for the marker with the smallest ratio of -constant / coefficient.
     *
     * 2) The row with a restricted basic variable and the smallest ratio
     *    of constant / coefficient.
     *
     * 3) The last unrestricted row which contains the marker.
     *
     * If the marker does not exist in any row, an invalid symbol will be
     * returned. This indicates an internal solver error since the marker
     * *should* exist somewhere in the tableau.
     *
     * @private
     */
    private _getMarkerLeavingSymbol;
    /**
     * Remove the effects of a constraint on the objective function.
     *
     * @private
     */
    private _removeConstraintEffects;
    /**
     * Remove the effects of an error marker on the objective function.
     *
     * @private
     */
    private _removeMarkerEffects;
    /**
     * Get the first Slack or Error symbol in the row.
     *
     * If no such symbol is present, an invalid symbol will be returned.
     *
     * @private
     */
    private _anyPivotableSymbol;
    /**
     * Returns a new Symbol of the given type.
     *
     * @private
     */
    private _makeSymbol;
    private _cnMap;
    private _rowMap;
    private _varMap;
    private _editMap;
    private _infeasibleRows;
    private _objective;
    private _artificial;
    private _idTick;
}
