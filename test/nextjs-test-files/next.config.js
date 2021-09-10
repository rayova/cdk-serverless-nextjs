module.exports = {
  // Use a constant build id value so snapshot tests note real changes
  generateBuildId: async () => 'CONSTANT_VALUE',
}