import * as bluetoothPlugin from './src/plugins/ble/index'
import * as systemOverlayPlugin from './src/plugins/systemOverlay/index'
import * as menuPlugin from './src/plugins/menu/index'

// Feedback
import * as robotFeedbackPlugin from './src/plugins/feedback/robot/index'
import * as textFeedbackPlugin from './src/plugins/feedback/text/index'
import * as BrightnessFeedbackPlugin from './src/plugins/feedback/brightness/index'

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
    name: "System Neurofeedback",
    target: "electron",

    pages: {
        settings: './src/pages/settings/settings.html'
    },

    electron: {
        window: OVERLAY ? TRANSPARENT_WINDOW_SETTINGS : {},
        // win: { requestedExecutionLevel: 'requireAdministrator' }
    },

    // services: {
    //     brainflow: "./src/services/brainflow.py",
    // },

    plugins: {
        bluetooth: bluetoothPlugin,
        menu: menuPlugin,

        textFeedback: textFeedbackPlugin,
        brightnessFeedback: BrightnessFeedbackPlugin,
        // robotFeedback: robotPlugin,

        // brainflow {
        //     load: function () {
        //         const { SERVICES: { brainflow : { url }} } = commoners
                
        //         return {
        //             get: async (path) => {
        //                 const endpoint = new URL(path, url)
        //                 const result = await fetch(endpoint.href)
        //                 const json = await result.json()
        //                 return json
        //             },
        //             post: async (path, body) => {
        //                 const endpoint = new URL(path, url)
        //                 const result = await fetch(endpoint.href, { method: 'POST', body: JSON.stringify(body) })
        //                 const json = await result.json()
        //                 return json
        //             }
        //         }
        //     }
        // },

    }
}

if (OVERLAY) config.plugins.systemOverlay = systemOverlayPlugin

export default config