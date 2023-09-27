module.exports = {
  client: {
    service: {
      name: "Spotter",
      // URL to the GraphQL API
      url: process.env.VUE_APP_BACKEND_API_URL,
    },
    // Files processed by the extension
    includes: ["src/**/*.vue", "src/**/*.js"],
  },
};
