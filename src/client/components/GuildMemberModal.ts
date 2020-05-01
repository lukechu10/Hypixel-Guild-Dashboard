import { css, CSSResult, customElement, html, LitElement, property, TemplateResult } from "lit-element";
import { until } from "lit-html/directives/until";

const transitionDuration = 300;

@customElement("guild-member-modal")
export class GuildMemberModal extends LitElement {
    @property({ type: Object }) public member: any;

    static get styles(): CSSResult {
        return css`
            .dimmer {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;

                transition: all ${transitionDuration}ms;
                visibility: hidden;
                opacity: 0;
                background: black;   
                z-index: -1;
            }
            .show .dimmer {
                visibility: visible;
                opacity: 0.8;
                z-index: 1;
            }

            .content {
                z-index: 10;

                opacity: 0;
                background-color: white;
                position: fixed;
                top: 0;
                left: 0;
                transition: all ${transitionDuration}ms;
                border-radius: 3px;
                padding-left: 20px;
                width: 80%;
                margin-left: 10%;
                margin-top: calc(50vh - (85px / 2));
            }

            .show .content {
                opacity: 1;
            }
        `;
    }

    protected render(): TemplateResult {
        let template: TemplateResult;
        if (this.member) {
            const getNameContext = this.getName(this.member.uuid);
            template = html`
                <h1>${until(getNameContext, "Loading...")}</h1>
                <h5>${this.member?.rank} | Quest Participiation: ${this.member.questParticipation}</h5>
            `;

        }
        else template = html``;

        return html`
            <div class="dimmer-container">
                <div class="dimmer"></div>
                <div class="content">
                    ${template}
                </div>
            </div> 
        `;
    }

    public showModal(member: any): void {
        this.member = member;
        this.renderRoot.querySelector(".dimmer-container")!.classList.add("show");

        this.addEventListener("click", () => {
            // hide modal
            this.renderRoot.querySelector(".dimmer-container")!.classList.remove("show");
        }, { once: true });
    }

    private async getName(uuid: string) {
        const resJson = await (await fetch(`api/username/${uuid}`)).json();
        const name = resJson[resJson.length - 1].name;
        return name;
    }
}