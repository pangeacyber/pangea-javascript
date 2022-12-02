module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    stream: require.resolve("stream-browserify"),
    crypto: false,
    http: false,
    https: false,
    tty: false,
    os: false,
    zlib: false,
    path: false,
    fs: false,
  });
  config.resolve.fallback = fallback;
  return config;
};
