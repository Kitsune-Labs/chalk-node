/* eslint-disable no-undef */
// Spoof supports-color
require("./_supports-color.js")(__dirname);

const chalk = require("..");

test("don't output colors when manually disabled", () => {
	const oldLevel = chalk.level;
	chalk.level = 0;
	expect(chalk.red("foo")).toBe("foo");
	chalk.level = oldLevel;
});

test("enable/disable colors based on overall chalk .level property, not individual instances", () => {
	const oldLevel = chalk.level;
	chalk.level = 1;
	const {red} = chalk;
	expect(red.level).toBe(1);
	chalk.level = 0;
	expect(red.level).toBe(chalk.level);
	chalk.level = oldLevel;
});

test("propagate enable/disable changes from child colors", () => {
	const oldLevel = chalk.level;
	chalk.level = 1;
	const {red} = chalk;
	expect(red.level).toBe(1);
	expect(chalk.level).toBe(1);
	red.level = 0;
	expect(red.level).toBe(0);
	expect(chalk.level).toBe(0);
	chalk.level = 1;
	expect(red.level).toBe(1);
	expect(chalk.level).toBe(1);
	chalk.level = oldLevel;
});


global.console.log = jest.fn();

test("disable colors if they are not supported", async () => {
	require("./_fixture");

	expect(global.console.log).toHaveBeenCalledWith("\x1B[38;2;255;97;89mtestout\x1B[39m \x1B[38;2;255;97;89mtesterr\x1B[39m");
});