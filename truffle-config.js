module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",  // Localhost
      port: 7545,         // Port number where Ganache is running
      network_id: "*",    // Match any network id
    }
  },
  // Other configuration
};