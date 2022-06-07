/* eslint-disable no-undef */
const chalk = require("..");

test("Chalk.constructor should throw an expected error", () => {
	expect(() => chalk.constructor()).toThrow("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
});