import { registerDevicePlugins, registerOutputPlugins } from 'neurosys/commoners'
import { devices, outputs, system } from 'neurosys/features'


const DEBUG = false

const config = {
    name: "HEGBeta",
    target: "electron",

    icon: "./src/assets/icon.png",

    services: {
        volume: "./src/services/volume/main.ts"
    },

    plugins: {

        // --------------------------------- Required Plugins --------------------------------- //
        overlay: system.overlay({ debug: DEBUG }),
        menu: system.menu({ icon: "./src/assets/iconTemplate.png", icon2x: "./src/assets/iconTemplate@2x.png" }), // Control the application through a system tray
        settings: system.settings, // Allow for managing and saving the active protocol
        bluetooth: system.bluetooth, // For Desktop Support
        serial: system.serial, // For Desktop Support

        // --------------------------------- Optional Plugins --------------------------------- //
        ...registerDevicePlugins({
            heg: devices.heg,
        }),

        ...registerOutputPlugins({
            cursor: outputs.cursor,
            brightnesss: outputs.brightness
        })
    }
}

export default config