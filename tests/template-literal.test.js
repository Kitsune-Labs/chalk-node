/* eslint-disable no-undef */
// Spoof supports-color
require("./_supports-color.js")(__dirname);

const chalk = require("..");

test("return an empty string for an empty literal", () => {
	const instance = new chalk.Instance();
	expect(instance``).toBe("");
});

test("return a regular string for a literal with no templates", () => {
	const instance = new chalk.Instance({ level: 0 });
	expect(instance`hello`).toBe("hello");
});

test("correctly perform template parsing", () => {
	const instance = new chalk.Instance({ level: 0 });
	expect(instance`{bold Hello, {cyan World!} This is a} test. {green Woo!}`)
		.toBe(`${instance.bold("Hello,", instance.cyan("World!"), "This is a")} test. ${instance.green("Woo!")}`);
});

test("correctly perform template substitutions", () => {
	const instance = new chalk.Instance({ level: 0 });
	const name = "Sindre";
	const exclamation = "Neat";

	expect(instance`{bold Hello, {cyan.inverse ${name}!} This is a} test. {green ${exclamation}!}`)
		.toBe(`${instance.bold("Hello,", instance.cyan.inverse(name + "!"), "This is a")} test. ${instance.green(exclamation + "!")}`);
});

test("correctly perform nested template substitutions", () => {
	const instance = new chalk.Instance({ level: 0 });
	const name = "Sindre";
	const exclamation = "Neat";

	expect(instance.bold`Hello, {cyan.inverse ${name}!} This is a` + " test. " + instance.green`${exclamation}!`)
		.toBe(instance.bold("Hello,", instance.cyan.inverse(name + "!"), "This is a") + " test. " + instance.green(exclamation + "!"));

	expect(instance.red.bgGreen.bold`Hello {italic.blue ${name}}`)
		.toBe(instance.red.bgGreen.bold("Hello " + instance.italic.blue(name)));

	expect(instance.strikethrough.cyanBright.bgBlack`Works with {reset {bold numbers}} {bold.red ${1}}`)
		.toBe(instance.strikethrough.cyanBright.bgBlack(`Works with ${instance.reset.bold("numbers")} ${instance.bold.red(1)}`));

	expect(chalk.bold`Also works on the shared {bgBlue chalk} object`)
		.toBe(
			"\u001B[1mAlso works on the shared \u001B[1m" +
			"\u001B[44mchalk\u001B[49m\u001B[22m" +
			"\u001B[1m object\u001B[22m"
		);
});

test("correctly parse and evaluate color-convert functions", () => {
	const instance = new chalk.Instance({ level: 3 });
	expect(instance`{bold.rgb(144,10,178).inverse Hello, {~inverse there!}}`)
		.toBe(
			"\u001B[1m\u001B[38;2;144;10;178m\u001B[7mHello, " +
			"\u001B[27m\u001B[39m\u001B[22m\u001B[1m" +
			"\u001B[38;2;144;10;178mthere!\u001B[39m\u001B[22m"
		);

	expect(instance`{bold.rgb(144,10,178).inverse Hello, {~inverse there!}}`)
		.toBe(
			"\u001B[1m\u001B[38;2;144;10;178m\u001B[7mHello, " +
			"\u001B[27m\u001B[39m\u001B[22m\u001B[1m" +
			"\u001B[38;2;144;10;178mthere!\u001B[39m\u001B[22m"
		);
});

test("properly handle escapes", () => {
	const instance = new chalk.Instance({ level: 3 });

	expect(instance`{bold hello \{in brackets\}}`)
		.toBe("\u001B[1mhello {in brackets}\u001B[22m");
});

test("throw if there is an unclosed block", () => {
	const instance = new chalk.Instance({ level: 3 });

	try {
		console.log(instance`{bold this shouldn't appear ever\}`);
		error();
	} catch (error) {
		expect(error.message).toBe("Chalk template literal is missing 1 closing bracket (`}`)");
	}

	try {
		console.log(instance`{bold this shouldn't {inverse appear {underline ever\} :) \}`);
		error();
	} catch (error) {
		expect(error.message).toBe("Chalk template literal is missing 3 closing brackets (`}`)");
	}
});

test("throw if there is an invalid style", () => {
	const instance = new chalk.Instance({ level: 3 });
	try {
		console.log(instance`{abadstylethatdoesntexist this shouldn't appear ever}`);
		error();
	} catch (error) {
		expect(error.message).toBe("Unknown Chalk style: abadstylethatdoesntexist");
	}
});

test("properly style multiline color blocks", () => {
	const instance = new chalk.Instance({ level: 3 });

	expect(
		instance`{bold
			Hello! This is a
			${"multiline"} block!
			:)
		} {underline
			I hope you enjoy
		}`
	).toBe(
		"\u001B[1m\u001B[22m\n" +
		"\u001B[1m\t\t\tHello! This is a\u001B[22m\n" +
		"\u001B[1m\t\t\tmultiline block!\u001B[22m\n" +
		"\u001B[1m\t\t\t:)\u001B[22m\n" +
		"\u001B[1m\t\t\u001B[22m \u001B[4m\u001B[24m\n" +
		"\u001B[4m\t\t\tI hope you enjoy\u001B[24m\n" +
		"\u001B[4m\t\t\u001B[24m"
	);
});

test("escape interpolated values", () => {
	const instance = new chalk.Instance({ level: 0 });

	expect(instance`Hello {bold hi}`).toBe("Hello hi");
	expect(instance`Hello ${"{bold hi}"}`).toBe("Hello {bold hi}");
});

test("allow custom colors (themes) on custom contexts", () => {
	const instance = new chalk.Instance({ level: 3 });
	instance.rose = instance.hex("#F6D9D9");

	expect(instance`Hello, {rose Rose}.`).toBe("Hello, \u001B[38;2;246;217;217mRose\u001B[39m.");
});

test("correctly parse newline literals (bug #184)", () => {
	const instance = new chalk.Instance({ level: 0 });

	expect(instance`Hello
{red there}`).toBe("Hello\nthere");
});

test("correctly parse newline escapes (bug #177)", () => {
	const instance = new chalk.Instance({ level: 0 });

	expect(instance`Hello\nthere!`).toBe("Hello\nthere!");
});

test("correctly parse escape in parameters (bug #177 comment 318622809)", () => {
	const instance = new chalk.Instance({ level: 0 });
	const string = "\\";

	expect(instance`{blue ${string}}`).toBe("\\");
});

test("correctly parses unicode/hex escapes", () => {
	const instance = new chalk.Instance({ level: 0 });

	expect(instance`\u0078ylophones are fo\x78y! {magenta.inverse \u0078ylophones are fo\x78y!}`)
		.toBe("xylophones are foxy! xylophones are foxy!");
});

test("correctly parses string arguments", () => {
	const instance = new chalk.Instance({ level: 3 });

	expect(instance`{keyword('black').bold can haz cheezburger}`)
		.toBe("\u001B[38;2;0;0;0m\u001B[1mcan haz cheezburger\u001B[22m\u001B[39m");
	expect(instance`{keyword('blac\x6B').bold can haz cheezburger}`)
		.toBe("\u001B[38;2;0;0;0m\u001B[1mcan haz cheezburger\u001B[22m\u001B[39m");
	expect(instance`{keyword('blac\u006B').bold can haz cheezburger}`)
		.toBe("\u001B[38;2;0;0;0m\u001B[1mcan haz cheezburger\u001B[22m\u001B[39m");
});

test("throws if a bad argument is encountered", () => {
	const instance = new chalk.Instance({ level: 3 }); // Keep level at least 1 in case we optimize for disabled chalk instances

	try {
		console.log(instance`{keyword(????) hi}`);
		error();
	} catch (error) {
		expect(error.message).toBe("Invalid Chalk template style argument: ???? (in style 'keyword')");
	}
});

test("throws if an extra unescaped } is found", () => {
	const instance = new chalk.Instance({ level: 0 });
	try {
		console.log(instance`{red hi!}}`);
		error();
	} catch (error) {
		expect(error.message).toBe("Found extraneous } in Chalk template literal");
	}
});

test("should not parse upper-case escapes", () => {
	const instance = new chalk.Instance({ level: 0 });
	expect(instance`\N\n\T\t\X07\x07\U000A\u000A\U000a\u000a`).toBe("N\nT\tX07\x07U000A\u000AU000a\u000A");
});

test("should properly handle undefined template interpolated values", () => {
	const instance = new chalk.Instance({ level: 0 });
	expect(instance`hello ${undefined}`).toBe("hello undefined");
	expect(instance`hello ${null}`).toBe("hello null");
});

test("should allow bracketed Unicode escapes", () => {
	const instance = new chalk.Instance({ level: 3 });
	expect(instance`\u{AB}`).toBe("\u{AB}");
	expect(instance`This is a {bold \u{AB681}} test`).toBe("This is a \u001B[1m\u{AB681}\u001B[22m test");
	expect(instance`This is a {bold \u{10FFFF}} test`).toBe("This is a \u001B[1m\u{10FFFF}\u001B[22m test");
});
