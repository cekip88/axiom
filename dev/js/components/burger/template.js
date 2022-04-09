export default {
	'burger': (data={}) => `
		<link rel="stylesheet" href="./components/burger/style.css">
		<slot name="test">
			<span slot="test">${data['text'] ?? ''}</span>
		</slot>
		<span class="g-burger" data-click="openBurger">
			<span class="g-burger-item"></span>	
		</span>
	`
}