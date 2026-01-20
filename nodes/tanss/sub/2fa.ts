import { createHmac } from 'crypto';

function normalizeBase32Input(input: string): string {
	if (!input) return '';
	const uriMatch = input.match(/secret=([^&]+)/i);
	if (uriMatch) input = decodeURIComponent(uriMatch[1]);
	return input.replace(/[\s-]/g, '').replace(/=+$/, '').toUpperCase();
}

function base32ToBuffer(base32: string): Buffer {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
	let bits = '';
	const bytes: number[] = [];

	base32 = normalizeBase32Input(base32);

	for (const char of base32) {
		const val = alphabet.indexOf(char);
		if (val === -1) continue;
		bits += val.toString(2).padStart(5, '0');
	}

	for (let i = 0; i + 8 <= bits.length; i += 8) {
		bytes.push(parseInt(bits.substring(i, i + 8), 2));
	}

	return Buffer.from(bytes);
}

export function generateTOTP(secret: string, window = 0): string {
	if (!secret) {
		throw new Error('No 2FA secret provided');
	}

	const epoch = Math.floor(Date.now() / 1000);
	const counter = Math.floor(epoch / 30) + window;

	const buffer = Buffer.alloc(8);
	buffer.writeUInt32BE(0, 0);
	buffer.writeUInt32BE(counter, 4);

	const key = base32ToBuffer(secret);
	const hmac = createHmac('sha1', key).update(buffer).digest();

	const offset = hmac[hmac.length - 1] & 0xf;
	const code =
		((hmac[offset] & 0x7f) << 24) |
		((hmac[offset + 1] & 0xff) << 16) |
		((hmac[offset + 2] & 0xff) << 8) |
		(hmac[offset + 3] & 0xff);

	return (code % 1_000_000).toString().padStart(6, '0');
}
