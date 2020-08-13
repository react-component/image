module.exports = {
  setupFiles: ['./tests/setup.ts'],
  snapshotSerializers: [require.resolve('enzyme-to-json/serializer')],
};
