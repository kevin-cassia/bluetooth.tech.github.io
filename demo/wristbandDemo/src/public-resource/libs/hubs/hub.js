var hubConfig = require('../../config/hubConfig.json')
let Hub = function (config) {
    config = config || {}
    this.output = {
        scan: '',
        notify: ''
    }
    this._escapeTime = {
        token: 0,
        devices: 0,
        scanData: 0,
        clearZombyScanData: 0,
        sortByRssi: 0,
        checkOnline: 0
    }
    this.scanData = {
        origin: {},
        sort: {
            name: {},
            rssi: []
        }
    }

    this.info = {
        method: config.method || hubConfig.info.method,
        server: 'http://' + config.server || hubConfig.info.cloundAddress,
        developer: config.developer || hubConfig.info.developer,
        password: config.password || hubConfig.info.password,
        interval: hubConfig.info.tokenExpire,
        ip: 'http://' + config.ip || '',
        location: config.location,
        mac: config.mac,
        access_token: '',
        authorization: ''
    }
    this.config = {
        maxConnected: config.maxConnected || hubConfig.config.maxConnected,
        maxConnected0: config.maxConnected0 || hubConfig.config.maxConnected0,
        maxConnected1: config.maxConnected1 || hubConfig.config.maxConnected1
    }
    this.status = {
        online: false, // Is router online?
        conn: 0, // Number of connections
        doing: { // What you are doing
            scan: 2, //0:Chip 0 scan; 1: chip 1 scan; 2 means stop scanning
            node: '' // MAC being connected to the device
        }
    }
    this.connetedPeripherals = { // Connected devices
        checkConnTime: hubConfig.connetedPeripherals.checkConnTime, // Check connection time period
        CheckConnTimeExp: 0, // Time expiration check
        Peripherals: { //
            peripheralsMac: {
                // node: '',
                // name: '',
                // type: '',
                // chipId: null // Connected chip ID
                // notify: '', // Whether to notify
                // expectedNotify: '', // Expectation of notification
                // checkNotifyTime: 3, // Notify time check
                // checkNotifyTimeExp: 0 // Notify time expiration check
            }
        }
    }

}



export default Hub