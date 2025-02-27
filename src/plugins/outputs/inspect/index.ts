import { Output } from 'neurosys/plugins'

export default new Output({
    label: 'Inspect Data',

    async start() {

        // Dynamic import to avoid conflict with Commoners
        const HEGInfo = (await import('./HEGInfo')).HEGInfo

        const featuresDiv = document.createElement("div")
        featuresDiv.style.position = "absolute"
        featuresDiv.style.top = "50px";
        featuresDiv.style.left = "10px";
        featuresDiv.style.display = "flex";
        featuresDiv.style.flexDirection = "column";
        featuresDiv.style.gap = "10px";

        const hegInfoDisplay = new HEGInfo()
        featuresDiv.append(hegInfoDisplay)
        document.body.append(featuresDiv)

        return { 
            container: featuresDiv,
            heg: hegInfoDisplay
        }
    },
    stop({ container }) {
        container.remove()
    },
    set({ heg }, info) {
        const { heg: hegEl } = info
        console.log(heg, info)
        if (heg) hegEl.data = heg
    }
})