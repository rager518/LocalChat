const os = require('os');

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const ipAddresses = [];

  for (const interfaceName in interfaces) {
    for (const netInterface of interfaces[interfaceName]) {
      if (netInterface.family === 'IPv4' && !netInterface.internal) {
        ipAddresses.push(netInterface.address);
      }
    }
  }

  return ipAddresses;
}

const ipAddresses = getLocalIpAddresses();
console.log('Local IP Addresses:', ipAddresses);
