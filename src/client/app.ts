import { css, CSSResult, customElement, html, LitElement, property, TemplateResult } from "lit-element";

@customElement("app-view")
class App extends LitElement {
    @property({ type: Object }) private guildData: any | null = null;
    @property({ type: Number }) private numMembers: number | string = "...";
    @property({ type: String }) private guildExpStr: string = "...";

    public constructor() {
        super();
        (async () => {
            const res = await (await fetch("/api/guild")).json();
            this.guildData = res;
            console.log(this.guildData);
            this.numMembers = this.guildData.guild.members.length;
            this.guildExpStr = `${Math.round(res.guild.exp / 1000000)}M`;
        })();
    }

    static get styles(): CSSResult {
        return css`
            * {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
            }

            h3 {
                font-weight: inherit;
            }

            h3 span {
                font-weight: bold;
            }

            .App-right {
                float: right;
            }
        `;
    }

    protected render(): TemplateResult {
        return html`
            <h1>Bloody Bedwars</h1>
            <h3>
                <span>${this.numMembers}</span> Members
                <div class="App-right">
                    <span>${this.guildExpStr}</span> Guild Experience
                </div>
            </h3>
        `;
    }
}
