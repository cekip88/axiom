import GComponent from "../g.component.js";
export default class GBurger extends GComponent {
	constructor() {
		super();
		const _ = this;
		_.on('openBurger',_.open.bind(_));


	}
	open(clickData){
		const _ = this;
		clickData['item'].setAttribute('open',true);
	}
	async connectedCallback() {
		const _ = this;
		await _.importTpl('./burger/template.js');
		_.shadow = this.attachShadow({mode: 'open'});
		let tpl = _.getTpl('burger');
		_.appendTpl(tpl);
	}
	disconnectedCallback() {
		console.log('Ket nahuy!')
	}

	static get observedAttributes() {
		return ['right','color'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// вызывается при изменении одного из перечисленных выше атрибутов
	}

	adoptedCallback() {
		// вызывается, когда элемент перемещается в новый документ
		// (происходит в document.adoptNode, используется очень редко)
	}
	async render(){
		const _ = this;
		console.log(_.shadowRoot)
		this.changeCssStyle('.g-burger','color',this.getAttribute('color'))
	}
}
customElements.define("g-burger", GBurger);