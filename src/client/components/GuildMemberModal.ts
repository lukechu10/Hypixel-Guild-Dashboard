import { css, CSSResult, customElement, html, LitElement, property, TemplateResult } from "lit-element";

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
                opacity: 0;
                background: black;   
                z-index: -1;
            }
            .show .dimmer {
                opacity: 0.8;
                z-index: 1;
            }

            .content {
                opacity: 0;
                background-color: white;
                position: fixed;
                top: 0;
                left: 0;
                transition: all ${transitionDuration}ms;
                z-index: 10;
            }

            .show .content {
                opacity: 1;
            }
        `;
    }

    protected render(): TemplateResult {
        return html`
            <div class="dimmer-container">
                <div class="dimmer"></div>
                <div class="content">
                    <h1>${this.member?.rank}</h1>
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
}
