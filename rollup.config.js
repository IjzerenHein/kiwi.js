export default {
	input: 'es/kiwi.js',
	output: {
        file: 'lib/kiwi.js',
        format: 'umd',
        name: 'kiwi',
        exports: 'named',
    },
    onwarn: function (warning) {
        // TS emits some helpers with code that causes rollup to carp.  This disables that error.
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        console.error(warning.message);
    }
}