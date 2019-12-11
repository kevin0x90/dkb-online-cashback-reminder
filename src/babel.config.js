module.exports = function(api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        targets: 'last 5 Chrome versions',
        corejs: { version: 3, proposals: true },
      },
    ],
  ];

  const plugins = ['@babel/plugin-transform-template-literals'];

  return {
    presets,
    plugins,
  };
};
