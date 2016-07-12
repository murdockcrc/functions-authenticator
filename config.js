module.exports = {
    IoTHub: {
        name: process.env.IOT_HUB_NAME || 'cbpi-lab.azure-devices.net',
        connectionString: {
            registryReadWrite: process.env.IOT_HUB_CONNECTION_STRING || 'HostName=cbpi-lab.azure-devices.net;SharedAccessKeyName=registryReadWrite;SharedAccessKey=' 
        }
    },
    deviceId: process.env.IOT_DEVICE_ID || 'test-3d9fdff0-3c65-11e6-a57a-23558d933620',
    deviceKey: process.env.IOT_DEVICE_TOKEN
}