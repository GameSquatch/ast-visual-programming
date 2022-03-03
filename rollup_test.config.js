import multi from '@rollup/plugin-multi-entry';


export default {
    input: 'test_build/**/*_tests.js',
    output: {
        file: 'test/run_tests.js',
        format: 'cjs'
    },
    external: [
        'uuid',
        'chai'
    ],
    plugins: [multi()]
};