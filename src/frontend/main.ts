import './style.css'

import { Protocol,  getClient, outputs, setValueInSettings, setDeviceRequestHandler, setDeviceDiscoveryHandler, registerPlugins, getAllServerSidePlugins, loadSettings } from 'neurosys'
import { features as featurePlugins, scores as scorePlugins } from 'neurosys/features'
import { DeviceList, DeviceDiscoveryList, createModal } from './ui'



const protocol = new Protocol({ heg: featurePlugins.heg }) // Only include the HEG feature

const runCalculation = () => {
  if (!protocol) return
  const client = getClient()
  return protocol.calculate(client, scorePlugins.heg) // Only calculate the HEG score
}


const { SERVICES, READY } = commoners

const UPDATE_INVERVAL = 250

READY.then(async (PLUGINS) => {

  await registerPlugins(PLUGINS)

  // Register all service plugins
  // NOTE: Declaring this after the main plugins ensures that the main plugins are loaded with priority
  const urlsByService = Object.entries(SERVICES).reduce((acc, [key, value]) => ({ ...acc, [key]: value.url }), {})
  const servicePlugins = await getAllServerSidePlugins(urlsByService)
  for (const serviceName in servicePlugins) {
    const plugins = servicePlugins[serviceName]
    await registerPlugins(plugins)
  }

  // Load settings after all services are available
  loadSettings()

  // Start calculating
  setInterval(runCalculation, UPDATE_INVERVAL)

})

outputs.onToggle(async (key, enabled) => {

  const ref = outputs.getPlugin(key)

  if (!ref) return

  const { __info, __latest } = ref

  const toggledFromPrevState = enabled == !ref.enabled

  const hasNotChanged = !enabled && !toggledFromPrevState

  const callback = enabled ? 'start' : 'stop'
  const info = (ref[callback] && !hasNotChanged) ? (ref.__info = (await ref[callback](__info)) ?? {}) : __info

  // Ensure the appropriate callback is called before the state is toggled
  const state = outputs.togglePlugin(key, enabled)
  await setValueInSettings(`outputs.${key}.enabled`, state)

  if (hasNotChanged) return
  if (!state) return

  ref.set(__latest, info) // Set the plugin score immediately when toggled
})


setDeviceRequestHandler(async (devices) => {

  return new Promise((resolve, reject) => {

    const list = new DeviceList({
      devices,

      // Success
      onSelect: async (device, protocol) => {
        resolve({ device, protocol })
        modal.close()
      }
    })

    const modal = createModal({ title: 'Neurofeedback Devices', content: list })

    modal.addEventListener('close', () => {
      modal.remove()
      reject('No device selected')
    })

    document.body.append(modal)
    modal.showModal()
  })

})


setDeviceDiscoveryHandler(async (onSelect) => {

    let device = '';

    const onModalClosed = () => {
      onSelect(device)
      modal.remove()
    }

    const list = new DeviceDiscoveryList({ 
      emptyMessage: 'Searching...',
      onSelect: (deviceId) => {
        device = deviceId
        modal.close()
      } 
    })
  
    const modal = createModal({ title: 'Discovered USB Devices',  content: list })
    document.body.append(modal)
    modal.showModal()

    modal.addEventListener('close', onModalClosed)
  
    
    return (devices) => list.devices = devices

})