
export const isSupported = {
  load: ({ WEB, MOBILE }) => {
    if (WEB) return 'serial' in navigator // Ensure serial feature is available
    if (MOBILE) return MOBILE === 'android'
  },
}

export const ready = function () {
  this.CALLBACKS = {}
}

export const desktop = {
  load: function ( win ) {

    const { __id } = win
    const { session } = win.webContents
  

    this.on(`${__id}:select`, (_, port) =>  this.CALLBACKS[__id]?.(port));
    session.on('serial-port-added', (_, port) =>  this.send(`${__id}:added`, port))
    session.on('serial-port-removed', (_, port) => this.send(`${__id}:removed`, port))

    session.on('select-serial-port', (event, portList, webContents, callback) => {

      const window = this.electron.BrowserWindow.fromWebContents(webContents);
      if (__id !== window.__id) return // Skip if the attached window did not trigger the request


      this.send(`${__id}:request`, portList);

      event.preventDefault()
      this.CALLBACKS[__id] = (port) => {
        this.CALLBACKS[__id] = null // Ensures this is only called once
        callback(port)
      }

    })
  
    session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => true)
    session.setDevicePermissionHandler((details) => true)
  }
}

export function load() {

  const { DESKTOP } = commoners

  if (!DESKTOP) return

  const { __id } = DESKTOP
  
  const onDeviceAdded = (callback) => this.on(`${__id}:added`, (_, port) => callback(port))
  const onDeviceRemoved = (callback) => this.on(`${__id}:removed`, (_, port) => callback(port))
  const select = (port) => this.send(`${__id}:select`, port)
  const onRequest =(callback) => this.on(`${__id}:request`, (_, value) => callback(value))

  return {
    onDeviceAdded, 
    onDeviceRemoved,
    select,
    onRequest
  }

}