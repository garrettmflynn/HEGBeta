import { registerDevicePlugins, registerFeaturePlugins, registerOutputPlugins, registerScorePlugins } from './src/packages/neuro.sys/core/src/commoners'

// Devices
import hegDevicePlugin from './src/packages/neuro.sys/plugins/devices/heg/index'

// Features
import hegRatioPlugin from './src/packages/neuro.sys/plugins/features/heg/index'

// Output
import * as robotOutputPlugin from './src/packages/neuro.sys/plugins/outputs/robot/index'
import * as textOutputPlugin from './src/packages/neuro.sys/plugins/outputs/text/index'
import * as brightnessOutputPlugin from './src/packages/neuro.sys/plugins/outputs/brightness/index'
import * as cursorOutputPlugin from './src/packages/neuro.sys/plugins/outputs/cursor/index'
import spotifyOutputPlugin from './src/packages/neuro.sys/plugins/outputs/spotify/index'
import inspectOutputPlugin from './src/packages/neuro.sys/plugins/outputs/inspect/index'

// Scores
import * as hegScorePlugin from './src/packages/neuro.sys/plugins/scores/heg/index'

// Other Plugins
import * as systemOverlayPlugin from './src/packages/neuro.sys/plugins/other/systemOverlay/index'
import * as menuPlugin from './src/packages/neuro.sys/plugins/other/menu/index'
import * as bluetoothPlugin from './src/packages/neuro.sys/plugins/other/devices/ble/index'
import * as serialPlugin from './src/packages/neuro.sys/plugins/other/devices/serial/index'
import protocolsPlugin from './src/packages/neuro.sys/plugins/other/protocols/index'


const OVERLAY = true
// const OVERLAY = false

const TRANSPARENT_WINDOW_SETTINGS = {
    frame: false,
    transparent: true,
    focusable: false,
    hasShadow: false,
    thickFrame: false, // Windows
    roundedCorners: false // MacOS
}

const config = {
    name: "HEGBeta",
    target: "electron",

    icon: "./src/assets/icon.png",

    pages: {
        // spotify: './src/plugins/outputs/spotify/index.html',
    },

    electron: {
        window: OVERLAY ? TRANSPARENT_WINDOW_SETTINGS : {},
    },

    // services: {
    //     brainflow: "./src/services/brainflow.py",
    // },

    plugins: {


        // --------------------------------- Required Plugins --------------------------------- //
        menu: menuPlugin, // Control the application through a system tray
        settings: protocolsPlugin, // Allow for managing and saving the active protocol
        bluetooth: bluetoothPlugin, // For Desktop Support
        serial: serialPlugin, // For Desktop Support


        // --------------------------------- Optional Plugins --------------------------------- //
        ...registerDevicePlugins({
            hegDevice: hegDevicePlugin,
        }),
            
        ...registerFeaturePlugins({
            hegRatio: hegRatioPlugin,
        }),

        ...registerOutputPlugins({
            textOutput: textOutputPlugin,
            cursorOutput: cursorOutputPlugin,
            brightnessOutput: brightnessOutputPlugin,
            // inspectOutput: inspectOutputPlugin,
            
            // // Experimental Plugins
            // spotifyOutput: spotifyOutputPlugin
            // robotOutput: robotPlugin,

        }),

        ...registerScorePlugins({
            hegScore: hegScorePlugin,
        }),
    }
}

if (OVERLAY) config.plugins.systemOverlay = systemOverlayPlugin

 
export default config