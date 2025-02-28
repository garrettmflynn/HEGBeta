import { LitElement, html, css } from 'lit';

type Norms = {
    min?: number,
    max?: number
}

type HEGInfoProps = {
    data?: {
        score: number,
        red: number,
        ir: number
    },
    norms?: {
        red?: Norms,
        ir?: Norms
    }
}

class Normalizer {

    min: number
    max: number

    constructor({ min = NaN, max = NaN } = {}) {
        this.min = min
        this.max = max
    }

    update(value: number) {
        this.min = isNaN(this.min) ? value : (value < this.min ? value : this.min);
        this.max = isNaN(this.max) ? value : (value > this.max ? value : this.max);
    }

    normalize(value: number) {
        return (value - this.min) / (this.max - this.min)
    }
}

export class HEGInfo extends LitElement {
  static styles = css`

    :host {
        font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        max-width: 500px
    }

    h3 {
        margin: 0px;
    }

    .bubble {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
        background: #111;
        border-radius: 5px;
        padding: 10px 20px;
        width: min-content
    }

    .readout {
        display: flex;
        gap: 10px;
        align-items: end;
        border-radius: 5px;
        background: #111;
        color: white;
        width: min-content;
        white-space: nowrap;
    }

    .readout > span {
        font-size: 90%;
    }

    #channels-container .channel {
        display: flex;
        justify-content: end;
        align-items: center;
        gap: 20px;
        padding: 10px 20px;

    }

    #channels-container .channel:not(:first-child) {
        padding-top: 0px
    }

    #channels-container .channel strong {
        font-size: 90%;
    }

    #channels-container .bands {
        display: flex;
        width: 150px;
        height: 10px;
        border-radius: 5px;
        overflow: hidden;
        background: #444;
        
    }

    .band {
        height: 100%;
    }

    .band.red {
        background: #ff6969;
    }

    .band.ir {
        background:rgb(255, 207, 207);
    }

  `;

  static properties = {
    data: { type: Object }
  };

  declare data: HEGInfoProps['data']
  #norms: {
    red: Normalizer,
    ir: Normalizer
  }

  constructor({ data, norms = {} }: HEGInfoProps = {}) {
    super();
    this.data = data;
    this.#norms = {
        red: new Normalizer(norms.red),
        ir: new Normalizer(norms.ir)
    }
  }

  render() {

    if (!this.data) return "" // no data

    const { score, red, ir } = this.data

    const ratio = red / ir

    this.#norms.red.update(red)
    this.#norms.ir.update(ir)

    const redRatio = this.#norms.red.normalize(red)
    const irRatio = this.#norms.ir.normalize(ir)
    

    return html`
    <div class="bubble">
        <span class="readout"><b>Score</b><span>${isNaN(score) ? '—' : score.toFixed(2)}</span></span>
    </div>

    <div class="bubble">
        <span class="readout"><b>Ratio</b> <span>${isNaN(ratio) ? '—' : ratio.toFixed(3)}</span></span>
    </div>

    <div class="bubble">
        <div id="channels-container">
            <div class="channel">
                <small>${this.#norms.red.min.toFixed(1)}</small>
                <div class="bands">
                    <div class="band red" style="width: ${redRatio * 100}%"></div>
                </div>
                <small>${this.#norms.red.max.toFixed(1)}</small>

            </div>
            <div class="channel">
                <small>${this.#norms.ir.min.toFixed(1)}</small>
                <div class="bands">
                    <div class="band ir" style="width: ${irRatio * 100}%"></div>
                </div>
                <small>${this.#norms.ir.max.toFixed(1)}</small>
            </div>
        </div>
    </div>
    `;
  }
}

customElements.define('heg-info', HEGInfo);
