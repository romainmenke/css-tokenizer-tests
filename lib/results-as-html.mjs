import fs from 'fs/promises';

export async function resultsAsHTML(testResults) {
	let content = html`<section>
	<h2>Summary</h2>
	${table(testResults, true)}
</section>`;

	for (const test in testResults.tests) {
		content += html`<section>
	<h2>${test}</h2>
	${table(testResults.tests[test], false)}
</section>`;
	}

	await fs.writeFile('index.html', page(content));
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
		table {
			margin: 0 auto;
			max-width: 900px;
			width: 100%;
			border-collapse: collapse;
			border-spacing: 0;
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
	${body}
</body>
</html>
`;
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

export function html(strings, ...values) {
	return String.raw({ raw: strings }, ...values);
}
