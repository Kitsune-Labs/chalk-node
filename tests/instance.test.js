/* eslint-disable no-undef */
// Spoof supports-color
require("./_supports-color.js")(__dirname);
const chalk = require("..");

test("create an isolated context where colors can be disabled (by level)", () => {
	const instance = new chalk.Instance({ level: 0 });

	expect(instance.red("foo")).toBe("foo");
	expect(chalk.red("foo")).toBe("\u001B[31mfoo\u001B[39m");

	instance.level = 2;

	expect(instance.red("foo")).toBe("\u001B[31mfoo\u001B[39m");
});

test("the `level` option should be a number from 0 to 3", () => {
	expect(() => new chalk.Instance({ level: 10 })).toThrow(/should be an integer from 0 to 3/);
	expect(() => new chalk.Instance({ level: -1 })).toThrow(/should be an integer from 0 to 3/);
});