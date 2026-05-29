import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const subDir = path.join(rootDir, 'nodes', 'tanss', 'sub');
const ignoredCamelCaseTerms = ['AnyDesk', 'TeamViewer'];
const displayNamePattern = /displayName:\s*'((?:\\.|[^'])*)'/gms;
const camelCasePattern = /[a-z][A-Z]/;

async function getFiles(dirPath) {
	const entries = await readdir(dirPath, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const entryPath = path.join(dirPath, entry.name);
			if (entry.isDirectory()) {
				return getFiles(entryPath);
			}

			return entry.isFile() && entry.name.endsWith('.ts') ? [entryPath] : [];
		}),
	);

	return files.flat();
}

function getLineNumber(text, index) {
	return text.slice(0, index).split('\n').length;
}

function stripIgnoredTerms(value) {
	return ignoredCamelCaseTerms.reduce((currentValue, ignoredTerm) => currentValue.replaceAll(ignoredTerm, ''), value);
}

async function scanFile(filePath) {
	const content = await readFile(filePath, 'utf8');
	const findings = [];

	for (const match of content.matchAll(displayNamePattern)) {
		const fullValue = match[1];
		const normalizedValue = stripIgnoredTerms(fullValue);
		if (!camelCasePattern.test(normalizedValue)) {
			continue;
		}

		findings.push({
			filePath,
			line: getLineNumber(content, match.index ?? 0),
			displayName: fullValue,
		});
	}

	return findings;
}

async function main() {
	const files = await getFiles(subDir);
	const findingsPerFile = await Promise.all(files.map((filePath) => scanFile(filePath)));
	const findings = findingsPerFile.flat();

	if (findings.length === 0) {
		console.log('No invalid displayName CamelCase found in nodes/tanss/sub.');
		return;
	}

	console.error('Found invalid displayName CamelCase in nodes/tanss/sub:');
	for (const finding of findings) {
		const relativePath = path.relative(rootDir, finding.filePath).replaceAll('\\', '/');
		console.error(`- ${relativePath}:${finding.line} -> ${finding.displayName}`);
	}

	process.exitCode = 1;
}

main().catch((error) => {
	console.error('Failed to scan displayName values.', error);
	process.exitCode = 1;
});
