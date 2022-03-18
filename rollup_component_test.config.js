import svelte from 'rollup-plugin-svelte';
import multi from '@rollup/plugin-multi-entry';
import css from 'rollup-plugin-css-only';

const production = false;

export default {
	input: 'test_build/component_tests/*.test.js',
	output: {
		sourcemap: false,
		format: 'cjs',
		file: 'test/run_component_tests.js'
	},
	plugins: [
		multi(),
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		css({ output: 'bundle.css' })
	]
};
