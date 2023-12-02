// @ts-check
import { join } from 'path';

import forms from '@tailwindcss/forms';
import { skeleton } from '@skeletonlabs/tw-plugin';

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)],
	theme: {
		extend: {}
	},
	plugins: [
		forms,
		skeleton({
			themes: { preset: [ {name: "wintry", enhancements: true} ] }
		})
	]
};
