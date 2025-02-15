import { bandpower as calculateBandPower } from './bcijs/bandpower'


type BandSpecification = string[]

type Data = Record<string, number[]>
type Window = [number, number]
type SamplingRate = number

type CalculationProperties = {
    data: Data
    window: Window
    sfreq: SamplingRate
}



export default {
    load() {
        return {
            feature: { label: 'Bandpowers' },

            // Create a set of all requested bands accross all channels
            aggregateSettings: (settings: BandSpecification[]) => {
                const bands = settings.reduce((acc, val) => acc.concat(val), [])
                return [ ...new Set(bands) ]
            },

            calculate(
                { data, window, sfreq }: CalculationProperties,
                requesters: BandSpecification[]
            ) {

                const uniqueBands = [ ...new Set(requesters.reduce((acc, val) => acc.concat(val), []) ) ]

                return Object.entries(data).reduce((acc, [ch, chData]) => {

                    const sliced = chData.slice(...window)

                    const powers = calculateBandPower(
                        sliced,
                        sfreq,
                        uniqueBands,
                        { relative: true }
                    )

                    acc[ch] = uniqueBands.reduce((acc, band, idx) => {
                        acc[band] = powers[idx]
                        return acc
                    }, {})

                    return acc

                }, {})

            }
        }
    }
}
