module.exports = {
  client: {
    service: {
      name: "Spotter",
      // URL to the GraphQL API
      url: "https://dev.spotterfitness.com/graphql",
    },
    // Files processed by the extension
    includes: ["src/**/*.vue", "src/**/*.js"],
  },
};
