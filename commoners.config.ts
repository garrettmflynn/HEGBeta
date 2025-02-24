import { registerDevicePlugins, registerFeaturePlugins, registerOutputPlugins, registerScorePlugins } from 'neurosys/config'
import { devices, features, scores, outputs, system } from 'neurosys/plugins'

const config = {
    name: "HEGBeta",
    target: "electron",

    icon: "./src/assets/icon.png",

    pages: {
        // spotify: './src/plugins/outputs/spotify/index.html',
    },

    electron: {
        window: {
            frame: false,
            transparent: true,
            focusable: false,
            hasShadow: false,
            thickFrame: false, // Windows
            roundedCorners: false // MacOS
        }
    },

    services: {
        // brainflow: "./src/services/brainflow.py",
        volume: "./app/services/volume/main.ts"
    },

    plugins: {

        // --------------------------------- Required Plugins --------------------------------- //
        overlay: system.overlay, // For transparent overlay window
        menu: system.menu({ icon: "./app/assets/iconTemplate.png", icon2x: "./app/assets/iconTemplate@2x.png" }), // Control the application through a system tray
        settings: system.settings, // Allow for managing and saving the active protocol
        bluetooth: system.bluetooth, // For Desktop Support
        serial: system.serial, // For Desktop Support



        // --------------------------------- Optional Plugins --------------------------------- //
        ...registerDevicePlugins({
            heg: devices.heg,
        }),
            
        ...registerFeaturePlugins({
            heg: features.hegRatio,
        }),

        ...registerOutputPlugins({
            text: outputs.text,
            cursor: outputs.cursor,
            brightnesss: outputs.brightness
        }),

        ...registerScorePlugins({
            heg: scores.hegScore,
        }),
    }
}

export default config