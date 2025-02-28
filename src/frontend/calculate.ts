import { getClient, calculate } from 'neurosys'
import { features as featurePlugins, scores as scorePlugins } from 'neurosys/features'

export const runCalculation = async () => {
  const client = getClient()
  return await calculate(client, scorePlugins.heg, featurePlugins) // Load all default features, but only calculate for the HEG score
}