/* eslint-disable no-undef */
// Spoof supports-color
require("./_supports-color.js")(__dirname, {
	stdout: {
		level: 0,
		hasBasic: false,
		has256: false,
		has16m: false
	},
	stderr: {
		level: 0,
		hasBasic: false,
		has256: false,
		has16m: false
	}
});

const chalk = require("..");

test("colors can be forced by using chalk.level", () => {
	chalk.level = 1;
	expect(chalk.green("hello")).toBe("\u001B[32mhello\u001B[39m");
});