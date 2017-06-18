export default{
        entry: './build/client/client.js',
        sourceMap: true,
        format: 'iife',
        moduleName: 'towncrier',
        banner: "//Towncrier v0.1",
        dest: './dist/bundle.js'
};