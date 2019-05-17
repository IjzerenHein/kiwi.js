# kiwi.js

[![view on npm](http://img.shields.io/npm/v/kiwi.js.svg)](https://www.npmjs.org/package/kiwi.js)
[![Build Status](https://travis-ci.org/IjzerenHein/kiwi.js.svg?branch=master)](https://travis-ci.org/IjzerenHein/kiwi.js)
[![codecov](https://codecov.io/gh/IjzerenHein/kiwi.js/branch/master/graph/badge.svg)](https://codecov.io/gh/IjzerenHein/kiwi.js)

Kiwi.js is a fast TypeScript implementation of the Cassowary constraint solving algorithm, based on the seminal Cassowary paper.
Originally created by Chris Colbert, it was redesigned from the ground up to be lightweight, fast and easy to maintain. View the [benchmarks](#benchmarks) to see how it compares to [Cassowary.js](https://github.com/slightlyoff/cassowary.js).


## Index
- [Getting started](#getting-started)
- [Documentation](#documentation)
- [Benchmarks](#benchmarks)
- [Tests](#tests)

## Getting started

Install using NPM:

	npm install kiwi.js

The following example creates a solver which automatically calculates the width:

```javascript
import * as kiwi from 'kiwi.js';
import { equal } from 'assert';

// Create a solver
var solver = new kiwi.Solver();

// Create edit variables
var left = new kiwi.Variable();
var width = new kiwi.Variable();
solver.addEditVariable(left, kiwi.Strength.strong);
solver.addEditVariable(width, kiwi.Strength.strong);
solver.suggestValue(left, 100);
solver.suggestValue(width, 400);

// Create and add a constraint
var right = new kiwi.Variable();
solver.addConstraint(new kiwi.Constraint(new kiwi.Expression([-1, right], left, width), kiwi.Operator.Eq));

// Solve the constraints
solver.updateVariables();
equal(right.value(), 500);
```

## Documentation

- [API Reference](docs/Kiwi.md)


## Benchmarks

To run the benchmark in the browser, [just visit this page](https://rawgit.com/IjzerenHein/kiwi/master/bench/index.html).

To run the benchmark locally using nodejs, *clone or download this repository* and execute the following steps:

	npm install
	npm run bench


## Tests

To run the tests in the browser, [just visit this page](https://rawgit.com/IjzerenHein/kiwi/master/test/index.html).

To run the tests locally using nodejs, *clone or download this repository* and execute the following steps:

	npm install
	npm run build && npm run test


## Contribute

If you like this project and want to support it, show some love
and give it a star.
