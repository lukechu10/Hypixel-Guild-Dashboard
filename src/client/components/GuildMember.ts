import { css, CSSResult, customElement, html, LitElement, property, TemplateResult } from "lit-element";
import moment from "moment";

@customElement("guild-member")
export class GuildMember extends LitElement {
    @property({ type: Object }) public member: any;

    static get styles(): CSSResult {
        return css`
            p {
                display: block;
                border-radius: 3px;
                margin-top: 0;
                margin-bottom: 0;
                padding: 5px;
                transition: all 200ms;
                will-change: background-color transform box-shadow;
            }

            p:hover {
                background-color: rgba(150, 150, 150, 0.1);
                transform: translateX(3px);
                box-shadow: 0px 15px 28px -1px rgba(170, 170, 170, 0.3);
            }
        `;
    }

    public connectedCallback(): void {
        super.connectedCallback();
    }

    protected render(): TemplateResult {
        return html`
            <p>
                <b>${this.member.name}</b>
                ${this.member.rank}
                <span style="float: right;">joined ${moment(this.member.joined).fromNow()}</span>
            </p>
        `;
    }
}