import { LitElement, html, css } from 'lit';

type HEGInfoProps = {
    data: Record<string, Record<string, number>>
}

export class HEGInfo extends LitElement {
  static styles = css`

    :host {
        font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: min-content
    }

    h3 {
        margin: 0px;
    }

    .bubble {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        color: white;
        background: #111;
        border-radius: 5px;
        padding: 10px 20px;
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

  constructor({ data = {} }: HEGInfoProps = { data: {}}) {
    super();
    this.data = data;
  }

  render() {

    const { score, red, ir } = this.data

    const ratio = red / ir

    return html`
    <div class="bubble">
        <span class="readout"><b>Score</b><span>${score ? score.toFixed(2)  : '—' }</span></span>
    </div>

    <div class="bubble">
        <span class="readout"><b>HEG Ratio</b> <span>${isNaN(ratio) ? '—' : ratio.toFixed(3)}</span></span>
    </div>

    <div class="bubble">
        <div id="channels-container">
            <div class="channel">
                <strong>Red</strong>
                <div class="bands">
                    <div class="band red" style="width: ${red * 100}%"></div>
                </div>
            </div>
            <div class="channel">
                <strong>Infrared</strong>
                <div class="bands">
                    <div class="band ir" style="width: ${ir * 100}%"></div>
                </div>
            </div>
        </div>
    </div>
    `;
  }
}

customElements.define('heg-info', HEGInfo);
