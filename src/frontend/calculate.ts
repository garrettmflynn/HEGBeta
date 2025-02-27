import { outputs, features, getClient } from 'neurosys'
import { features as featurePlugins } from 'neurosys/features'


const scoreNormalization = {
    min: 0,
    max: 1
}

  
export const calculate = async (
  client: any = getClient(),
) => {

  if (!client) return // No client connected yet

  // NOTE: Currently HEGBeta only has one feature, which is identical to the score
  const score = await features.calculate(featurePlugins.heg, {}, client)
  const calculatedFeatures = { heg: score }

  // Normalize the score between 0 and 1
  if (score < scoreNormalization.min) scoreNormalization.min = score
  if (score > scoreNormalization.max) scoreNormalization.max = score

  const { min, max } = scoreNormalization
  const normalizedScore = Math.max(0, Math.min(1, (score - min) / (max - min)))

  // Set the feedback from the calculated score and features
  outputs.set(normalizedScore, calculatedFeatures)
  return { score: normalizedScore, features: calculatedFeatures }
}

