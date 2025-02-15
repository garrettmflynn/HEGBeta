// NOTE: Paths are relative to project root
export const assets = {
    icon: "./src/assets/iconTemplate.png",
    icon2x: "./src/assets/iconTemplate@2x.png"
}

export function load() {
    return {
        showDeviceSelector: (callback) => this.on("devices.show", () => callback()),

        // Feedback Mechanisms
        registerFeedback: (key, plugin) => this.sendSync("feedback.register", { key, plugin }),
        onFeedbackToggle: (key, callback) => this.on(`feedback.${key}.toggle`, (_, enabled) => callback(enabled)),

        // Score Mechanisms
        registerScore: (key, plugin) => this.sendSync("score.register", { key, plugin }),
        onScoreToggle: (key, callback) => this.on(`score.${key}.toggle`, (_, enabled) => callback(enabled)),

        // Connection
        toggleDeviceConnection: (on = true) => this.send("connection.toggle", on),
        onDeviceDisconnect: (callback) => this.on("device.disconnect", () => callback()),

        // Settings
        onSaveSettings: (callback) => this.on("settings.save", () => callback()),
        loadSettings: (settings) => this.send("settings.load", settings),
        enableSettings: (enabled) => this.send("settings.enabled", enabled)
    }
}

export const desktop = {
    load: function () {

        const { plugin: { assets: { icon } }, electron } = this

        const { Menu, BrowserWindow, Tray, MenuItem } = electron

        const tray = new Tray(icon);

        const SUBMENU_IDS = {
            score: "score",
            feedback: "feedback"
        }

        const template = [
            { id: "settings", label: "Save Settings", enabled: false, click: () => this.send("settings.save") },
            { type: 'separator' },
            { id: SUBMENU_IDS.feedback, label: "Feedback", submenu: [] },
            { id: SUBMENU_IDS.score, label: "Score", submenu: [] },
            { type: 'separator' },
            { label: 'Quit', role: 'quit' }
        ]

        const rebuildMenu = () => Menu.buildFromTemplate(template)
        const updateContextMenu = () => tray.setContextMenu(rebuildMenu())

        const toggleConnection = (on = true) => {
            const idx = template.findIndex(item => item.id === "connect")

            const newItem = new MenuItem({
                id: "connect",
                label: on ? "Connect to Device" : "Disconnect Device",
                click: () => on ? this.send("devices.show") : this.send("device.disconnect")
            })

            if (idx > -1) template[idx] = newItem
            else template.unshift(newItem)

            updateContextMenu()
        }

        toggleConnection(true)
        updateContextMenu()

        tray.setToolTip('neurosys');
        tray.on('click', () => tray.popUpContextMenu()); // On Windows, it's ideal to open something from the app here...

        this.on("connection.toggle", (_, on) => toggleConnection(on))

        this.on("settings.enabled", (_, enabled) => {
            const idx = template.findIndex(item => item.id === "settings")
            template[idx].enabled = enabled
            updateContextMenu()
        })

        const REGISTERED = { feedback: {}, score: {} }
        const sendState = (id, key, enabled) => REGISTERED[id]?.[key] && this.send(`${id}.${key}.toggle`, enabled)
        const getAllItems = (id) => template.find(item => item.id === id)?.submenu ?? []
        const updateAllStates = (id) => getAllItems(id).forEach(item => sendState(id, item.id, item.checked))

        const registerNewItem = (
            id, 
            key, 
            options,
            updateAll = false
        ) => {

            const registered = REGISTERED[id] ?? ( REGISTERED[id] = {} )
            if (registered[key]) return false

            const foundItem = template.find(item => item.id === id)
            if (!foundItem) return

            const submenu = foundItem.submenu as any[]

            const item = new MenuItem({
                id: key,
                ...options,
                click: () => updateAll ? updateAllStates(id) : sendState(id, key, item.checked)
            })

            submenu.push(item)
            updateContextMenu()

            registered[key] = true

            return true

        }

        // ------------------------- Define Setting Options ------------------------- \\
        this.on("feedback.register", (ev, { key, plugin }) => {
            const { feedback, enabled = false } = plugin
            const success = registerNewItem(SUBMENU_IDS.feedback, key, { type: 'checkbox', checked: enabled, ...feedback })
            ev.returnValue = success
        })

        this.on("score.register", (ev, { key, plugin }) => {
            const { score, enabled = false } = plugin
            const success = registerNewItem( SUBMENU_IDS.score, key, { type: 'radio', checked: enabled, ...score }, true )
            ev.returnValue = success
        })

        // ------------------------- Allow Configuration based on Settings ------------------------- \\

        this.on("settings.load", (_, settings) => {

            for (const [ id, registered ] of Object.entries(REGISTERED)) {
                const categorySettings = settings[id] ?? {}
                const itemMetadata = Object.entries(registered).map(([ key, _ ]) => {
                    const itemSettings = categorySettings[key] ?? {}
                    const { enabled = false } = itemSettings
                    
                    const actualMenuItem = template.find(item => item.id === id).submenu.find(item => item.id === key)
                    if (actualMenuItem) {
                        const isRadio = actualMenuItem.type === "radio"
                        if (!isRadio || enabled) actualMenuItem.checked = enabled
                        return { radio: isRadio, item: actualMenuItem, enabled }
                    }
                })

                // Enable the first radio item by default, if none are enabled
                const radioItems = itemMetadata.filter(item => item?.radio)
                if (radioItems.length && !radioItems.find(item => item?.enabled)) radioItems[0].item.checked = true 

                updateAllStates(id) // Update all other states in case any changed
            }

            updateContextMenu()
        })

    }
}