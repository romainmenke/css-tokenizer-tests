import fs from 'fs/promises';

export async function resultsAsHTML(testResults, htmlFilePath) {
	let totalScores = '';
	for (const tokenizer in testResults.tokenizers) {
		const results = testResults.tokenizers[tokenizer];

		totalScores += html`<td>${results.pass} / ${results.checks}</td>`;
	}
	
	let content = html`<section>
	<h2>Summary</h2>

	<div style="margin-bottom: 64px;">
		<table>
			${thead([...Object.keys(testResults.tokenizers)])}
			<tbody>
				<tr style="text-align: center;">${totalScores}</tr>
			</tbody>
		</table>
	</div>

	${table(testResults, true)}
</section>`;

	for (const test in testResults.tests) {
		content += html`<section id="${test}">
	<h2>${test}</h2>
	${table(testResults.tests[test], false)}
</section>`;
	}

	await fs.writeFile(htmlFilePath, page(content));
}

function table(testResults, isSummary = true) {
	let rows = '';

	for (const test in testResults.tests) {
		let row = '';
		if (isSummary) {
			row = html`<td><a href="#${test}">${test}</a></td>`;
		} else {
			row = html`<td><a href="https://github.com/romainmenke/css-tokenizer-tests/blob/main/tests/${test}" target="_blank">${test}</a></td>`;
		}

		const subResults = testResults.tests[test];
		for (const tokenizer in subResults.tokenizers) {
			const tokenizerResult = subResults.tokenizers[tokenizer];

			row += html`<td>${tokenizerResult.pass} / ${tokenizerResult.checks}</td>`;
		}

		rows += html`<tr>${row}</tr>`;
	}

	return html`<table>
	${thead(['path', ...Object.keys(testResults.tokenizers)])}
	<tbody>
		${rows}
	</tbody>
</table>
`;
}

function thead(headings) {
	return html`<thead>
	<tr>
		<th>` + headings.join(html`</th>
<th>`) + html`</th>
</tr>
</thead>`;
}


function page(body) {
	return html`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>CSS Tokenizer Tests</title>

	<style>
		body {
			margin: 0 auto;
			max-width: 900px;
			padding: 16px;
			width: 100%;
		}

		table {
			width: 100%;
			border-collapse: collapse;
			border-spacing: 0;
		}

		h2 {
			margin-top: 48px;
		}

		td, th {
			padding: 16px;
		}
		
		td + td, th + th {
			border-left: 1px solid rgb(0, 0, 0, 0.2);
		}

		thead tr,
		tr:not(:last-child) {
			border-bottom: 1px solid rgb(0, 0, 0, 0.2);
		}
	</style>
</head>
<body>
	<h1>CSS Tokenizer tests</h1>

	<ul>
		<li><a href="./index.html">index.html</a></li>
		<li><a href="./index-minimal.html">index-minimal.html</a></li>
		<li><a href="./community.html">community.html</a></li>
	</ul>

	${body}
</body>
</html>
`;
}

export function html(strings, ...values) {
	return String.raw({ raw: strings }, ...values);
}
