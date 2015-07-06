(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (root['kiwi'] = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['kiwi'] = factory();
  }
}(this, function () {

/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/
// <reference path="expression.ts">
// <reference path="strength.ts">
var kiwi;
(function (kiwi) {
    /**
     * An enum defining the linear constraint operators.
     */
    (function (Operator) {
        Operator[Operator["Le"] = 0] = "Le";
        Operator[Operator["Ge"] = 1] = "Ge";
        Operator[Operator["Eq"] = 2] = "Eq"; // ==
    })(kiwi.Operator || (kiwi.Operator = {}));
    var Operator = kiwi.Operator;
    /**
     * A linear constraint equation.
     *
     * A constraint equation is composed of an expression, an operator,
     * and a strength. The RHS of the equation is implicitly zero.
     *
     * @class
     */
    var Constraint = (function () {
        /**
         * Construct a new Constraint.
         *
         * @param expression The constraint expression.
         * @param operator The equation operator.
         * @param strength The strength of the constraint.
         */
        function Constraint(expression, operator, strength) {
            if (strength === void 0) { strength = kiwi.Strength.required; }
            this._id = CnId++;
            this._operator = operator;
            this._expression = expression;
            this._strength = kiwi.Strength.clip(strength);
        }
        /**
         * A static constraint comparison function.
         */
        Constraint.Compare = function (a, b) {
            return a.id() - b.id();
        };
        /**
         * Returns the unique id number of the constraint.
         */
        Constraint.prototype.id = function () {
            return this._id;
        };
        /**
         * Returns the expression of the constraint.
         */
        Constraint.prototype.expression = function () {
            return this._expression;
        };
        /**
         * Returns the relational operator of the constraint.
         */
        Constraint.prototype.op = function () {
            return this._operator;
        };
        /**
         * Returns the strength of the constraint.
         */
        Constraint.prototype.strength = function () {
            return this._strength;
        };
        return Constraint;
    })();
    kiwi.Constraint = Constraint;
    /**
     * The internal constraint id counter.
     */
    var CnId = 0;
})(kiwi || (kiwi = {}));
/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/
var kiwi;
(function (kiwi) {
    /**
     * The primary user constraint variable.
     *
     * @class
     */
    var Variable = (function () {
        /**
         * Construct a new Variable
         *
         * @param [name] The name to associated with the variable.
         */
        function Variable(name) {
            if (name === void 0) { name = ""; }
            this._value = 0.0;
            this._context = null;
            this._id = VarId++;
            this._name = name;
        }
        /**
         * Returns the unique id number of the variable.
         */
        Variable.prototype.id = function () {
            return this._id;
        };
        /**
         * Returns the name of the variable.
         */
        Variable.prototype.name = function () {
            return this._name;
        };
        /**
         * Set the name of the variable.
         */
        Variable.prototype.setName = function (name) {
            this._name = name;
        };
        /**
         * Returns the user context object of the variable.
         */
        Variable.prototype.context = function () {
            return this._context;
        };
        /**
         * Set the user context object of the variable.
         */
        Variable.prototype.setContext = function (context) {
            this._context = context;
        };
        /**
         * Returns the value of the variable.
         */
        Variable.prototype.value = function () {
            return this._value;
        };
        /**
         * Set the value of the variable.
         */
        Variable.prototype.setValue = function (value) {
            this._value = value;
        };
        /**
         * Returns the JSON representation of the variable.
         */
        Variable.prototype.toJSON = function () {
            return {
                name: this._name,
                value: this._value
            };
        };
        return Variable;
    })();
    kiwi.Variable = Variable;
    /**
     * The internal variable id counter.
     */
    var VarId = 0;
})(kiwi || (kiwi = {}));
/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/
/// <reference path="variable.ts"/>
var kiwi;
(function (kiwi) {
    /**
     * An expression of variable terms and a constant.
     *
     * @class
     */
    var Expression = (function () {
        function Expression() {
            var parsed = parseArgs(arguments);
            this._terms = parsed.terms;
            this._constant = parsed.constant;
        }
        /**
         * Returns the mapping of terms in the expression.
         *
         * This *must* be treated as const.
         */
        Expression.prototype.terms = function () {
            return this._terms;
        };
        /**
         * Returns the constant of the expression.
         */
        Expression.prototype.constant = function () {
            return this._constant;
        };
        /**
         * Returns the computed value of the expression.
         */
        Expression.prototype.value = function () {
            var result = this._constant;
            this._terms.forEach(function (coefficient, variable) {
                result += variable.value() * coefficient;
            });
            return result;
        };
        return Expression;
    })();
    kiwi.Expression = Expression;
    /**
     * An internal argument parsing function.
     */
    function parseArgs(args) {
        var constant = 0.0;
        var terms = new Map();
        for (var i = 0, n = args.length; i < n; ++i) {
            var item = args[i];
            if (typeof item === "number") {
                constant += item;
            }
            else if (item instanceof kiwi.Variable) {
                terms.set(item, 1.0);
            }
            else if (item instanceof Array) {
                if (item.length !== 2) {
                    throw new Error("array must have length 2");
                }
                var value = item[0];
                var variable = item[1];
                if (typeof value !== "number") {
                    throw new Error("array item 0 must be a number");
                }
                if (!(variable instanceof kiwi.Variable)) {
                    throw new Error("array item 1 must be a variable");
                }
                terms.set(variable, value);
            }
            else {
                throw new Error("invalid Expression argument: " + item);
            }
        }
        return { terms: terms, constant: constant };
    }
})(kiwi || (kiwi = {}));
/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/
var kiwi;
(function (kiwi) {
    var Strength;
    (function (Strength) {
        /**
         * Create a new symbolic strength.
         */
        function create(a, b, c, w) {
            if (w === void 0) { w = 1.0; }
            var result = 0.0;
            result += Math.max(0.0, Math.min(1000.0, a * w)) * 1000000.0;
            result += Math.max(0.0, Math.min(1000.0, b * w)) * 1000.0;
            result += Math.max(0.0, Math.min(1000.0, c * w));
            return result;
        }
        Strength.create = create;
        /**
         * The 'required' symbolic strength.
         */
        Strength.required = create(1000.0, 1000.0, 1000.0);
        /**
         * The 'strong' symbolic strength.
         */
        Strength.strong = create(1.0, 0.0, 0.0);
        /**
         * The 'medium' symbolic strength.
         */
        Strength.medium = create(0.0, 1.0, 0.0);
        /**
         * The 'weak' symbolic strength.
         */
        Strength.weak = create(0.0, 0.0, 1.0);
        /**
         * Clip a symbolic strength to the allowed min and max.
         */
        function clip(value) {
            return Math.max(0.0, Math.min(Strength.required, value));
        }
        Strength.clip = clip;
    })(Strength = kiwi.Strength || (kiwi.Strength = {}));
})(kiwi || (kiwi = {}));
/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/
/// <reference path="constraint.ts"/>
/// <reference path="expression.ts"/>
/// <reference path="strength.ts"/>
/// <reference path="variable.ts"/>
var kiwi;
(function (kiwi) {
    /**
     * The constraint solver class.
     *
     * @class
     */
    var Solver = (function () {
        /**
         * Construct a new Solver.
         */
        function Solver() {
            this._cnMap = new Map();
            this._rowMap = new Map();
            this._varMap = new Map();
            this._editMap = new Map();
            this._infeasibleRows = [];
            this._objective = new Row();
            this._artificial = null;
            this._idTick = 0;
        }
        /**
         * Add a constraint to the solver.
         */
        Solver.prototype.addConstraint = function (constraint) {
            if (this._cnMap.has(constraint)) {
                throw new Error("duplicate constraint");
            }
            // Creating a row causes symbols to be reserved for the variables
            // in the constraint. If this method exits with an exception,
            // then its possible those variables will linger in the var map.
            // Since its likely that those variables will be used in other
            // constraints and since exceptional conditions are uncommon,
            // i'm not too worried about aggressive cleanup of the var map.
            var data = this._createRow(constraint);
            var row = data.row;
            var tag = data.tag;
            var subject = this._chooseSubject(row, tag);
            // If chooseSubject couldnt find a valid entering symbol, one
            // last option is available if the entire row is composed of
            // dummy variables. If the constant of the row is zero, then
            // this represents redundant constraints and the new dummy
            // marker can enter the basis. If the constant is non-zero,
            // then it represents an unsatisfiable constraint.
            if (subject.type() === 0 /* Invalid */ && row.allDummies()) {
                if (!nearZero(row.constant())) {
                    throw new Error("unsatifiable constraint");
                }
                else {
                    subject = tag.marker;
                }
            }
            // If an entering symbol still isn't found, then the row must
            // be added using an artificial variable. If that fails, then
            // the row represents an unsatisfiable constraint.
            if (subject.type() === 0 /* Invalid */) {
                if (!this._addWithArtificialVariable(row)) {
                    throw new Error("unsatisfiable constraint");
                }
            }
            else {
                row.solveFor(subject);
                this._substitute(subject, row);
                this._rowMap.set(subject, row);
            }
            this._cnMap.set(constraint, tag);
            // Optimizing after each constraint is added performs less
            // aggregate work due to a smaller average system size. It
            // also ensures the solver remains in a consistent state.
            this._optimize(this._objective);
        };
        /**
         * Remove a constraint from the solver.
         */
        Solver.prototype.removeConstraint = function (constraint) {
            var tag = this._cnMap.get(constraint);
            if (!tag) {
                throw new Error("unknown constraint");
            }
            this._cnMap.delete(constraint);
            // Remove the error effects from the objective function
            // *before* pivoting, or substitutions into the objective
            // will lead to incorrect solver results.
            this._removeConstraintEffects(constraint, tag);
            // If the marker is basic, simply drop the row. Otherwise,
            // pivot the marker into the basis and then drop the row.
            var marker = tag.marker;
            if (!this._rowMap.delete(marker)) {
                var leaving = this._getMarkerLeavingSymbol(marker);
                if (leaving.type() === 0 /* Invalid */) {
                    throw new Error("failed to find leaving row");
                }
                var row = this._rowMap.get(leaving);
                this._rowMap.delete(leaving);
                row.solveForEx(leaving, marker);
                this._substitute(marker, row);
            }
            // Optimizing after each constraint is removed ensures that the
            // solver remains consistent. It makes the solver api easier to
            // use at a small tradeoff for speed.
            this._optimize(this._objective);
        };
        /**
         * Test whether the solver contains the constraint.
         */
        Solver.prototype.hasConstraint = function (constraint) {
            return this._cnMap.has(constraint);
        };
        /**
         * Add an edit variable to the solver.
         */
        Solver.prototype.addEditVariable = function (variable, strength) {
            if (this._editMap.has(variable)) {
                throw new Error("duplicate edit variable");
            }
            strength = kiwi.Strength.clip(strength);
            if (strength === kiwi.Strength.required) {
                throw new Error("bad required strength");
            }
            var expr = new kiwi.Expression(variable);
            var cn = new kiwi.Constraint(expr, 2 /* Eq */, strength);
            this.addConstraint(cn);
            var tag = this._cnMap.get(cn);
            var info = { tag: tag, constraint: cn, constant: 0.0 };
            this._editMap.set(variable, info);
        };
        /**
         * Remove an edit variable from the solver.
         */
        Solver.prototype.removeEditVariable = function (variable) {
            var info = this._editMap.get(variable);
            if (info === undefined) {
                throw new Error("unknown edit variable");
            }
            this._editMap.delete(variable);
            this.removeConstraint(info.constraint);
        };
        /**
         * Test whether the solver contains the edit variable.
         */
        Solver.prototype.hasEditVariable = function (variable) {
            return this._editMap.has(variable);
        };
        /**
         * Suggest the value of an edit variable.
         */
        Solver.prototype.suggestValue = function (variable, value) {
            var _this = this;
            var info = this._editMap.get(variable);
            if (info === undefined) {
                throw new Error("unknown edit variable");
            }
            var rows = this._rowMap;
            var delta = value - info.constant;
            info.constant = value;
            // Check first if the positive error variable is basic.
            var marker = info.tag.marker;
            var row = rows.get(marker);
            if (row) {
                if (row.add(-delta) < 0.0) {
                    this._infeasibleRows.push(marker);
                }
                this._dualOptimize();
                return;
            }
            // Check next if the negative error variable is basic.
            var other = info.tag.other;
            var row = rows.get(other);
            if (row) {
                if (row.add(delta) < 0.0) {
                    this._infeasibleRows.push(other);
                }
                this._dualOptimize();
                return;
            }
            // Otherwise update each row where the error variables exist.
            rows.forEach(function (row, symbol) {
                var coeff = row.coefficientFor(marker);
                if (coeff !== 0.0 && row.add(delta * coeff) < 0.0 && symbol.type() !== 1 /* External */) {
                    _this._infeasibleRows.push(symbol);
                }
            });
            this._dualOptimize();
        };
        /**
         * Update the values of the variables.
         */
        Solver.prototype.updateVariables = function () {
            var _this = this;
            this._varMap.forEach(function (symbol, variable) {
                var row = _this._rowMap.get(symbol);
                if (row !== undefined) {
                    variable.setValue(row.constant());
                }
                else {
                    variable.setValue(0.0);
                }
            });
        };
        /**
         * Get the symbol for the given variable.
         *
         * If a symbol does not exist for the variable, one will be created.
         */
        Solver.prototype._getVarSymbol = function (variable) {
            var symbol = this._varMap.get(variable);
            if (!symbol) {
                symbol = this._makeSymbol(1 /* External */);
                this._varMap.set(variable, symbol);
            }
            return symbol;
        };
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
         */
        Solver.prototype._createRow = function (constraint) {
            var _this = this;
            var expr = constraint.expression();
            var row = new Row(expr.constant());
            // Substitute the current basic variables into the row.
            expr.terms().forEach(function (coefficient, variable) {
                if (!nearZero(coefficient)) {
                    var symbol = _this._getVarSymbol(variable);
                    var basicRow = _this._rowMap.get(symbol);
                    if (basicRow !== undefined) {
                        row.insertRow(basicRow, coefficient);
                    }
                    else {
                        row.insertSymbol(symbol, coefficient);
                    }
                }
            });
            // Add the necessary slack, error, and dummy variables.
            var objective = this._objective;
            var strength = constraint.strength();
            var tag = { marker: INVALID_SYMBOL, other: INVALID_SYMBOL };
            switch (constraint.op()) {
                case 0 /* Le */:
                case 1 /* Ge */:
                    {
                        var coeff = constraint.op() === 0 /* Le */ ? 1.0 : -1.0;
                        var slack = this._makeSymbol(2 /* Slack */);
                        tag.marker = slack;
                        row.insertSymbol(slack, coeff);
                        if (strength < kiwi.Strength.required) {
                            var error = this._makeSymbol(3 /* Error */);
                            tag.other = error;
                            row.insertSymbol(error, -coeff);
                            objective.insertSymbol(error, strength);
                        }
                        break;
                    }
                case 2 /* Eq */:
                    {
                        if (strength < kiwi.Strength.required) {
                            var errplus = this._makeSymbol(3 /* Error */);
                            var errminus = this._makeSymbol(3 /* Error */);
                            tag.marker = errplus;
                            tag.other = errminus;
                            row.insertSymbol(errplus, -1.0); // v = eplus - eminus
                            row.insertSymbol(errminus, 1.0); // v - eplus + eminus = 0
                            objective.insertSymbol(errplus, strength);
                            objective.insertSymbol(errminus, strength);
                        }
                        else {
                            var dummy = this._makeSymbol(4 /* Dummy */);
                            tag.marker = dummy;
                            row.insertSymbol(dummy);
                        }
                        break;
                    }
            }
            // Ensure the row has a positive constant.
            if (row.constant() < 0.0) {
                row.reverseSign();
            }
            return { row: row, tag: tag };
        };
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
         */
        Solver.prototype._chooseSubject = function (row, tag) {
            var found = INVALID_SYMBOL;
            row.cells().forEach(function (coefficient, symbol) {
                if (found === INVALID_SYMBOL && symbol.type() === 1 /* External */) {
                    found = symbol;
                }
            });
            if (found !== INVALID_SYMBOL) {
                return found;
            }
            var type = tag.marker.type();
            if (type === 2 /* Slack */ || type === 3 /* Error */) {
                if (row.coefficientFor(tag.marker) < 0.0) {
                    return tag.marker;
                }
            }
            type = tag.other.type();
            if (type === 2 /* Slack */ || type === 3 /* Error */) {
                if (row.coefficientFor(tag.other) < 0.0) {
                    return tag.other;
                }
            }
            return INVALID_SYMBOL;
        };
        /**
         * Add the row to the tableau using an artificial variable.
         *
         * This will return false if the constraint cannot be satisfied.
         */
        Solver.prototype._addWithArtificialVariable = function (row) {
            // Create and add the artificial variable to the tableau.
            var art = this._makeSymbol(2 /* Slack */);
            this._rowMap.set(art, row.copy());
            this._artificial = row.copy();
            // Optimize the artificial objective. This is successful
            // only if the artificial objective is optimized to zero.
            this._optimize(this._artificial);
            var success = nearZero(this._artificial.constant());
            this._artificial = null;
            // If the artificial variable is basic, pivot the row so that
            // it becomes non-basic. If the row is constant, exit early.
            var basicRow = this._rowMap.get(art);
            if (basicRow !== undefined) {
                this._rowMap.delete(art);
                if (basicRow.isConstant()) {
                    return success;
                }
                var entering = this._anyPivotableSymbol(basicRow);
                if (entering.type() === 0 /* Invalid */) {
                    return false; // unsatisfiable (will this ever happen?)
                }
                basicRow.solveForEx(art, entering);
                this._substitute(entering, basicRow);
                this._rowMap.set(entering, basicRow);
            }
            // Remove the artificial variable from the tableau.
            this._rowMap.forEach(function (row2) {
                row2.removeSymbol(art);
            });
            this._objective.removeSymbol(art);
            return success;
        };
        /**
         * Substitute the parametric symbol with the given row.
         *
         * This method will substitute all instances of the parametric symbol
         * in the tableau and the objective function with the given row.
         */
        Solver.prototype._substitute = function (symbol, row) {
            var _this = this;
            this._rowMap.forEach(function (enumRow, enumSymbol) {
                enumRow.substitute(symbol, row);
                if (enumRow.constant() < 0.0 && enumSymbol.type() !== 1 /* External */) {
                    _this._infeasibleRows.push(enumSymbol);
                }
            });
            this._objective.substitute(symbol, row);
            if (this._artificial) {
                this._artificial.substitute(symbol, row);
            }
        };
        /**
         * Optimize the system for the given objective function.
         *
         * This method performs iterations of Phase 2 of the simplex method
         * until the objective function reaches a minimum.
         */
        Solver.prototype._optimize = function (objective) {
            while (true) {
                var entering = this._getEnteringSymbol(objective);
                if (entering.type() === 0 /* Invalid */) {
                    return;
                }
                var leaving = this._getLeavingSymbol(entering);
                if (leaving.type() === 0 /* Invalid */) {
                    throw new Error("the objective is unbounded");
                }
                // pivot the entering symbol into the basis
                var row = this._rowMap.get(leaving);
                this._rowMap.delete(leaving);
                row.solveForEx(leaving, entering);
                this._substitute(entering, row);
                this._rowMap.set(entering, row);
            }
        };
        /**
         * Optimize the system using the dual of the simplex method.
         *
         * The current state of the system should be such that the objective
         * function is optimal, but not feasible. This method will perform
         * an iteration of the dual simplex method to make the solution both
         * optimal and feasible.
         */
        Solver.prototype._dualOptimize = function () {
            var rows = this._rowMap;
            var infeasible = this._infeasibleRows;
            while (infeasible.length !== 0) {
                var leaving = infeasible.pop();
                var row = rows.get(leaving);
                if (row && (row.constant() < 0.0)) {
                    var entering = this._getDualEnteringSymbol(row);
                    if (entering.type() === 0 /* Invalid */) {
                        throw new Error("dual optimize failed");
                    }
                    // pivot the entering symbol into the basis
                    rows.delete(leaving);
                    row.solveForEx(leaving, entering);
                    this._substitute(entering, row);
                    rows.set(entering, row);
                }
            }
        };
        /**
         * Compute the entering variable for a pivot operation.
         *
         * This method will return first symbol in the objective function which
         * is non-dummy and has a coefficient less than zero. If no symbol meets
         * the criteria, it means the objective function is at a minimum, and an
         * invalid symbol is returned.
         */
        Solver.prototype._getEnteringSymbol = function (objective) {
            var found = INVALID_SYMBOL;
            objective.cells().forEach(function (coefficient, symbol) {
                if ((found === INVALID_SYMBOL) && coefficient < 0.0 && symbol.type() !== 4 /* Dummy */) {
                    found = symbol;
                }
            });
            return found;
        };
        /**
         * Compute the entering symbol for the dual optimize operation.
         *
         * This method will return the symbol in the row which has a positive
         * coefficient and yields the minimum ratio for its respective symbol
         * in the objective function. The provided row *must* be infeasible.
         * If no symbol is found which meats the criteria, an invalid symbol
         * is returned.
         */
        Solver.prototype._getDualEnteringSymbol = function (row) {
            var _this = this;
            var ratio = Number.MAX_VALUE;
            var entering = INVALID_SYMBOL;
            row.cells().forEach(function (c, symbol) {
                if (c > 0.0 && symbol.type() !== 4 /* Dummy */) {
                    var coeff = _this._objective.coefficientFor(symbol);
                    var r = coeff / c;
                    if (r < ratio) {
                        ratio = r;
                        entering = symbol;
                    }
                }
            });
            return entering;
        };
        /**
         * Compute the symbol for pivot exit row.
         *
         * This method will return the symbol for the exit row in the row
         * map. If no appropriate exit symbol is found, an invalid symbol
         * will be returned. This indicates that the objective function is
         * unbounded.
         */
        Solver.prototype._getLeavingSymbol = function (entering) {
            var ratio = Number.MAX_VALUE;
            var found = INVALID_SYMBOL;
            this._rowMap.forEach(function (row, symbol) {
                if (symbol.type() !== 1 /* External */) {
                    var temp = row.coefficientFor(entering);
                    if (temp < 0.0) {
                        var temp_ratio = -row.constant() / temp;
                        if (temp_ratio < ratio) {
                            ratio = temp_ratio;
                            found = symbol;
                        }
                    }
                }
            });
            return found;
        };
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
         */
        Solver.prototype._getMarkerLeavingSymbol = function (marker) {
            var dmax = Number.MAX_VALUE;
            var r1 = dmax;
            var r2 = dmax;
            var invalid = INVALID_SYMBOL;
            var first = invalid;
            var second = invalid;
            var third = invalid;
            this._rowMap.forEach(function (row, symbol) {
                var c = row.coefficientFor(marker);
                if (c !== 0.0) {
                    if (symbol.type() === 1 /* External */) {
                        third = symbol;
                    }
                    else if (c < 0.0) {
                        var r = -row.constant() / c;
                        if (r < r1) {
                            r1 = r;
                            first = symbol;
                        }
                    }
                    else {
                        var r = row.constant() / c;
                        if (r < r2) {
                            r2 = r;
                            second = symbol;
                        }
                    }
                }
            });
            if (first !== invalid) {
                return first;
            }
            if (second !== invalid) {
                return second;
            }
            return third;
        };
        /**
         * Remove the effects of a constraint on the objective function.
         */
        Solver.prototype._removeConstraintEffects = function (cn, tag) {
            if (tag.marker.type() === 3 /* Error */) {
                this._removeMarkerEffects(tag.marker, cn.strength());
            }
            if (tag.other.type() === 3 /* Error */) {
                this._removeMarkerEffects(tag.other, cn.strength());
            }
        };
        /**
         * Remove the effects of an error marker on the objective function.
         */
        Solver.prototype._removeMarkerEffects = function (marker, strength) {
            var row = this._rowMap.get(marker);
            if (row) {
                this._objective.insertRow(row, -strength);
            }
            else {
                this._objective.insertSymbol(marker, -strength);
            }
        };
        /**
         * Get the first Slack or Error symbol in the row.
         *
         * If no such symbol is present, an invalid symbol will be returned.
         */
        Solver.prototype._anyPivotableSymbol = function (row) {
            var found = INVALID_SYMBOL;
            row.cells().forEach(function (coefficient, symbol) {
                var type = symbol.type();
                if (found === INVALID_SYMBOL && (type === 2 /* Slack */ || type === 3 /* Error */)) {
                    found = symbol;
                }
            });
            return found;
        };
        /**
         * Returns a new Symbol of the given type.
         */
        Solver.prototype._makeSymbol = function (type) {
            return new Symbol(type, this._idTick++);
        };
        return Solver;
    })();
    kiwi.Solver = Solver;
    /**
     * Test whether a value is approximately zero.
     */
    function nearZero(value) {
        var eps = 1.0e-8;
        return value < 0.0 ? -value < eps : value < eps;
    }
    /**
     * An enum defining the available symbol types.
     */
    var SymbolType;
    (function (SymbolType) {
        SymbolType[SymbolType["Invalid"] = 0] = "Invalid";
        SymbolType[SymbolType["External"] = 1] = "External";
        SymbolType[SymbolType["Slack"] = 2] = "Slack";
        SymbolType[SymbolType["Error"] = 3] = "Error";
        SymbolType[SymbolType["Dummy"] = 4] = "Dummy";
    })(SymbolType || (SymbolType = {}));
    /**
     * An internal class representing a symbol in the solver.
     */
    var Symbol = (function () {
        /**
         * Construct a new Symbol
         *
         * @param [type] The type of the symbol.
         * @param [id] The unique id number of the symbol.
         */
        function Symbol(type, id) {
            this._id = id;
            this._type = type;
        }
        /**
         * Returns the unique id number of the symbol.
         */
        Symbol.prototype.id = function () {
            return this._id;
        };
        /**
         * Returns the type of the symbol.
         */
        Symbol.prototype.type = function () {
            return this._type;
        };
        return Symbol;
    })();
    /**
     * A static invalid symbol
     */
    var INVALID_SYMBOL = new Symbol(0 /* Invalid */, -1);
    /**
     * An internal row class used by the solver.
     */
    var Row = (function () {
        /**
         * Construct a new Row.
         */
        function Row(constant) {
            if (constant === void 0) { constant = 0.0; }
            this._cellMap = new Map();
            this._constant = constant;
        }
        /**
         * Returns the mapping of symbols to coefficients.
         */
        Row.prototype.cells = function () {
            return this._cellMap;
        };
        /**
         * Returns the constant for the row.
         */
        Row.prototype.constant = function () {
            return this._constant;
        };
        /**
         * Returns true if the row is a constant value.
         */
        Row.prototype.isConstant = function () {
            return this._cellMap.size === 0;
        };
        /**
         * Returns true if the Row has all dummy symbols.
         */
        Row.prototype.allDummies = function () {
            var found = true;
            this._cellMap.forEach(function (coefficient, symbol) {
                if (symbol.type() !== 4 /* Dummy */) {
                    found = false;
                }
            });
            return found;
        };
        /**
         * Create a copy of the row.
         */
        Row.prototype.copy = function () {
            var theCopy = new Row(this._constant);
            this._cellMap.forEach(function (coefficient, symbol) {
                theCopy._cellMap.set(symbol, coefficient);
            });
            return theCopy;
        };
        /**
         * Add a constant value to the row constant.
         *
         * Returns the new value of the constant.
         */
        Row.prototype.add = function (value) {
            return this._constant += value;
        };
        /**
         * Insert the symbol into the row with the given coefficient.
         *
         * If the symbol already exists in the row, the coefficient
         * will be added to the existing coefficient. If the resulting
         * coefficient is zero, the symbol will be removed from the row.
         */
        Row.prototype.insertSymbol = function (symbol, coefficient) {
            if (coefficient === void 0) { coefficient = 1.0; }
            coefficient += this._cellMap.get(symbol) || 0;
            this._cellMap.set(symbol, coefficient);
            if (nearZero(coefficient)) {
                this._cellMap.delete(symbol);
            }
        };
        /**
         * Insert a row into this row with a given coefficient.
         *
         * The constant and the cells of the other row will be
         * multiplied by the coefficient and added to this row. Any
         * cell with a resulting coefficient of zero will be removed
         * from the row.
         */
        Row.prototype.insertRow = function (other, coefficient) {
            var _this = this;
            if (coefficient === void 0) { coefficient = 1.0; }
            this._constant += other._constant * coefficient;
            other._cellMap.forEach(function (otherCoeff, otherSymbol) {
                _this.insertSymbol(otherSymbol, otherCoeff * coefficient);
            });
        };
        /**
         * Remove a symbol from the row.
         */
        Row.prototype.removeSymbol = function (symbol) {
            this._cellMap.delete(symbol);
        };
        /**
         * Reverse the sign of the constant and cells in the row.
         */
        Row.prototype.reverseSign = function () {
            var _this = this;
            this._constant = -this._constant;
            this._cellMap.forEach(function (coefficient, symbol) {
                _this._cellMap.set(symbol, -coefficient);
            });
        };
        /**
         * Solve the row for the given symbol.
         *
         * This method assumes the row is of the form
         * a * x + b * y + c = 0 and (assuming solve for x) will modify
         * the row to represent the right hand side of
         * x = -b/a * y - c / a. The target symbol will be removed from
         * the row, and the constant and other cells will be multiplied
         * by the negative inverse of the target coefficient.
         *
         * The given symbol *must* exist in the row.
         */
        Row.prototype.solveFor = function (symbol) {
            var cells = this._cellMap;
            var coeff = -1.0 / cells.get(symbol);
            cells.delete(symbol);
            this._constant *= coeff;
            cells.forEach(function (c, sym) {
                cells.set(sym, c * coeff);
            });
        };
        /**
         * Solve the row for the given symbols.
         *
         * This method assumes the row is of the form
         * x = b * y + c and will solve the row such that
         * y = x / b - c / b. The rhs symbol will be removed from the
         * row, the lhs added, and the result divided by the negative
         * inverse of the rhs coefficient.
         *
         * The lhs symbol *must not* exist in the row, and the rhs
         * symbol must* exist in the row.
         */
        Row.prototype.solveForEx = function (lhs, rhs) {
            this.insertSymbol(lhs, -1.0);
            this.solveFor(rhs);
        };
        /**
         * Returns the coefficient for the given symbol.
         */
        Row.prototype.coefficientFor = function (symbol) {
            return this._cellMap.get(symbol) || 0.0;
        };
        /**
         * Substitute a symbol with the data from another row.
         *
         * Given a row of the form a * x + b and a substitution of the
         * form x = 3 * y + c the row will be updated to reflect the
         * expression 3 * a * y + a * c + b.
         *
         * If the symbol does not exist in the row, this is a no-op.
         */
        Row.prototype.substitute = function (symbol, row) {
            var existingRow = this._cellMap.get(symbol);
            if (existingRow !== undefined) {
                this._cellMap.delete(symbol);
                this.insertRow(row, existingRow);
            }
        };
        return Row;
    })();
})(kiwi || (kiwi = {}));
/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/
/// <reference path="constraint.ts"/>
/// <reference path="expression.ts"/>
/// <reference path="solver.ts"/>
/// <reference path="strength.ts"/>
/// <reference path="variable.ts"/>

return kiwi;

}));
