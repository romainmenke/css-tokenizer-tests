import path from 'path';
import { resultsAsHTML } from "./lib/results-as-html.mjs";
import { testCommunityCSSSources } from './lib/test-community-css-sources.mjs';
import { testFeatures } from "./lib/test-feature.mjs";
import { testFuzz } from './lib/test-fuzz.mjs';
import { traverseDir } from "./lib/traverse-dir.mjs";

{
	const testGroups = new Map();
	const tests = new Set();
	const testFiles = new Set(await traverseDir('./tests'));

	for (const testFile of testFiles) {
		const testFileParsed = path.parse(testFile);
		const testDirParsed = path.parse(testFileParsed.dir);
		const testGroupName = path.parse(testDirParsed.dir).base;
		const test = path.join(testGroupName, testDirParsed.base);

		{
			if (tests.has(test)) {
				continue;
			}

			tests.add(test);
		}

		if (
			testFiles.has(path.join(testFileParsed.dir, 'source.css')) &&
			testFiles.has(path.join(testFileParsed.dir, 'tokens.json'))
		) {
			const testGroup = testGroups.get(testGroupName) ?? {
				name: testGroupName,
				tests: []
			};

			testGroup.tests.push(test);
			testGroups.set(testGroupName, testGroup);
		}
	}

	const results = await testFeatures(Array.from(testGroups.values()));
	await resultsAsHTML(results, 'index.html');
}

{
	const testGroups = new Map();
	const tests = new Set();
	const testFiles = new Set(await traverseDir('./tests-community'));

	for (const testFile of testFiles) {
		const testFileParsed = path.parse(testFile);
		const testDirParsed = path.parse(testFileParsed.dir);
		const testGroupName = path.parse(testDirParsed.dir).base;
		const test = path.join(testGroupName, testDirParsed.base);

		{
			if (tests.has(test)) {
				continue;
			}

			tests.add(test);
		}

		if (
			testFiles.has(path.join(testFileParsed.dir, 'source.css')) &&
			testFiles.has(path.join(testFileParsed.dir, 'tokens.json'))
		) {
			const testGroup = testGroups.get(testGroupName) ?? {
				name: testGroupName,
				tests: []
			};

			testGroup.tests.push(test);
			testGroups.set(testGroupName, testGroup);
		}
	}

	const results = await testCommunityCSSSources(Array.from(testGroups.values()));
	await resultsAsHTML(results, 'community.html');
}


for (let i = 0; i < 5; i++) {
	testFuzz()
}
