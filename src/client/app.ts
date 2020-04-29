import { LitElement, customElement, html, TemplateResult, CSSResult, css } from "lit-element";

@customElement("app-view")
class App extends LitElement {
    static get styles(): CSSResult {
        return css`
            * {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
            }
        `;
    }

    protected render(): TemplateResult {
        return html`
            <h1>Bloody Bedwars</h1>
        `;
    }
}
