import { G_Bus } from "./libs/G_Control.js";
import G_G from "./libs/G_G.js";
import GInput from "./components/input/input.component.js";
import GSelect from "./components/select/select.component.js";
import Modaler from "./components/modaler/modaler.component.js";

class Front extends G_G{
	constructor(){
		super();
		const _ = this;

		_.head = _.f('.head');
		_.sliders = {};
		_.resolutions = {
			'mobile' : [0,767],
			'tablet' : [768,1023],
			'large-tablet' : [1024,1199],
			'desktop' : [1200,25000]
		};

		G_Bus
			.on('inputValidate',_.inputValidate.bind(_))
			.on('showNote',_.showNote.bind(_))
			.on('burger',_.burger.bind(_))
			.on('dotClick',_.dotClick.bind(_))
			.on('arrowClick',_.arrowClick.bind(_))
			.on('showBlogSearch',_.showBlogSearch.bind(_))
			.on('cancelBlogSearch',_.cancelBlogSearch.bind(_))
			.on('bodyClick',_.bodyClick.bind(_))
	}
	showNote(){
		G_Bus.trigger('showModal',{
			type: 'html',
			target: '#modal'
		});
	}
	inputValidate(clickData){
		const _ = this;
		let inpt  = _.f(clickData['item'].getAttribute('data-target'));
		inpt.doValidate();
	}

	bodyClick(clickData){
		const _ = this;
		let event = clickData.event,
			target = event.target;
		if (!target.closest('.search')) {
			_.cancelBlogSearch();
		}
	}

	burger(clickData){
		const _ = this;
		let btn = clickData.item;
		btn.classList.toggle('active');
		_.head.classList.toggle('active');
	}

	showBlogSearch(clickData){
		const _ = this;
		let btn = clickData.item;
		btn.classList.toggle('active');
		let searchBlock = _.f('.search');
		searchBlock.classList.toggle('active');
	}
	cancelBlogSearch(){
		const _ = this;
		let searchBlock = _.f('.search');
		let searchButton = _.f('.blog-search-btn');
		if (!searchButton) return;
		searchButton.classList.remove('active');
		searchBlock.classList.remove('active');
		searchBlock.querySelector('INPUT').value = '';
	}

	dotClick(clickData){
		const _ = this;
		let
			cont = clickData.item,
			event = clickData.event,
			target = event.target;

		let btn = target.closest('.dot');
		if (!btn) return;

		let position = cont.getAttribute('data-position');

		if (_.sliders[position]['ongoing']) return;
		_.sliders[position]['ongoing'] = true;

		_.sliders[position]['index'] = btn.getAttribute('data-id')

		_.slideChange(position)
	}
	dotAnimation(position){
		const _ = this;
		let
			cont = _.sliders[position]['dots'],
			id = _.sliders[position]['index'],
			target = cont.querySelector(`.dot[data-id="${id}"]`),
			targetX = target.offsetLeft,
			active = cont.querySelector('.dot-active'),
			activeDot = cont.querySelector('.dot.active'),
			activeX = active.offsetLeft;

		let moveData = _.getDotAnimData(targetX,activeX);

		activeDot.classList.remove('active');
		if (moveData.toRight) {
			active.style = `width:${moveData.width}px;left:${activeX}px;`;
			setTimeout(function (){
				active.style = `width:20px;left:${moveData.x}px`;
				target.classList.add('active')
			},350)
		} else {
			active.style = `width:${moveData.width}px;left:${moveData.x}px;`;
			setTimeout(function (){
				active.style = `width:20px;left:${moveData.x}px`;
				target.classList.add('active')
			},350)
		}
	}
	getDotAnimData(targetX,activeX){
		let width, x, toRight = targetX > activeX;
		if (toRight) {
			width = targetX - activeX + 16;
			x = width + activeX - 20;
		} else {
			width = activeX - targetX + 24;
			x = targetX - 4;
		}
		return {x,width,toRight}
	}
	arrowClick(clickData){
		const _ = this;
		let btn = clickData.item;
		if (btn.hasAttribute('disabled')) return;

		let
			direction = btn.getAttribute('data-direction'),
			position = btn.getAttribute('data-position');

		if (_.sliders[position]['ongoing']) return;
		_.sliders[position]['ongoing'] = true;

		if ((direction === 'next')) _.sliders[position]['index']++
		else _.sliders[position]['index']--
		_.slideChange(position)
	}
	arrowCheck(position){
		const _ = this;
		let
			next = _.sliders[position]['next'],
			prev = _.sliders[position]['prev'],
			index = _.sliders[position]['index'];

		if (index > 0) prev.removeAttribute('disabled');
		else prev.setAttribute('disabled',true);
		if (index >= _.sliders[position]['count'] - 1) next.setAttribute('disabled',true);
		else next.removeAttribute('disabled');
	}
	slideChange(position){
		const _ = this;

		if (_.sliders[position]['dots'])_.dotAnimation(position);
		if (_.sliders[position]['prev'])_.arrowCheck(position);

		_[_.sliders[position]['slider'].getAttribute('data-callback')](position);
		_.autoSwitch(position);
	}
	clientSliderChange(position){
		const _ = this;
		let sliderInfo = _.sliders[position];
		sliderInfo['inner'].style = `transform: translateX(-${297 * sliderInfo['index']}px);`;
		sliderInfo['ongoing'] = false;
	}
	reviewSliderChange(position){
		const _ = this;
		let sliderInfo = _.sliders[position];
		sliderInfo['inner'].firstElementChild.style = `margin-left:-${sliderInfo['index'] * 100}%;`;
		sliderInfo['ongoing'] = false;
	}
	mainSliderChange(position){
		const _ = this;
		let
			index = _.sliders[position]['index'],
			targetSlide = _.sliders[position]['inner'].querySelector(`.slide[data-id="${index}"]`),
			activeSlide = _.sliders[position]['inner'].querySelector('.active'),
			targetAnimBlocks = targetSlide.querySelectorAll('.anim'),
			activeAnimBlocks = activeSlide.querySelectorAll('.anim');

		_.slideAnimation({'blocks':activeAnimBlocks,'toShow':false});
		setTimeout(()=>{
			_.sliders[position]['inner'].prepend(targetSlide)
			_.slideAnimation({'blocks':targetAnimBlocks});
			activeSlide.classList.remove('active');
			targetSlide.classList.add('active');
			_.sliders[position]['ongoing'] = false;
			_.sliders[position]['slider'].className = `slider bgc${!(index % 2) ? '' : '-reverce'}`;
		},500);
	}
	slideAnimation(animData) {
		const _ = this;

		if (animData['index'] === animData['blocks'].length) return;
		if (animData['toShow'] === undefined) animData['toShow'] = true;
		if (animData['index'] === undefined) animData['index'] = 0;
		if (animData['time'] === undefined) animData['time'] = 100;

		if (animData['toShow']) {
			animData['blocks'][animData['index']].style = 'opacity:1;';
		} else {
			animData['blocks'][animData['index']].removeAttribute('style');
		}
		setTimeout(() => {
			animData['index']++;
			_.slideAnimation(animData)
		},animData['time'])
	}
	autoSwitch(key){
		const _ = this;
		let autoPlayTime = _.sliders[key]['slider'].getAttribute('auto-play');
		if (!autoPlayTime) return;
		if (_.sliders[key]['interval']) clearTimeout(_.sliders[key]['interval']);
		_.sliders[key]['interval'] = setTimeout(()=>{
			_.sliders[key]['index'] = parseInt(_.sliders[key]['index']) + 1;
			if (_.sliders[key]['index'] === _.sliders[key]['count']) _.sliders[key]['index'] = 0;
			_.slideChange(key);
		},autoPlayTime * 1000);
	}


	getResolution (){
		const _ = this;
		let resolution = window.innerWidth;
		let curResolution;
		for (let key in _.resolutions) {
			if (resolution >= _.resolutions[key][0]) curResolution = key;
			else break;
		}
		return curResolution;
	}
	checkSliderForResolution(slider){
		const _ = this;
		let curRes = _.getResolution();
		let dataRes = slider.getAttribute(`data-${curRes}`);
		return dataRes !== 'false';
	}
	slidersInit(){
		const _ = this;
		let sliders = document.querySelectorAll('.slider');

		for (let i = 0; i < sliders.length; i++) {
			let slider = sliders[i];

			_.sliders[i] = {slider};
			_.sliders[i]['inner'] = slider.querySelector('.slider-inner');
			_.sliders[i]['index'] = 0;
			_.sliders[i]['count'] = _.sliders[i]['inner'].children.length;

			if (slider.hasAttribute('data-short')) {
				if (window.innerWidth >= 768) _.sliders[i]['count']--;
			}

			_.dotsInit(i);
			_.arrowsInit(i);
			_.slideChange(i);
		}
	}
	dotsInit(position){
		const _ = this;
		let
			dotsCont = _.sliders[position]['slider'].querySelector('.slider-dots');
		if (!dotsCont) return;
		let
			count = _.sliders[position]['count'];
		dotsCont.innerHTML = '';

		if (count > 1 && _.checkSliderForResolution(_.sliders[position]['slider'])) {
			dotsCont.append(_.markup(`<div class="dot-active"></div>`));
			for (let i = 0; i < count; i++) {
				let dot = `<button data-id="${i}" class="dot${!i ? ' active' : ''}"></button>`;
				dotsCont.append(_.markup(dot));
				dotsCont.setAttribute('data-position',position);
				_.sliders[position]['dots'] = dotsCont;
			}
		}
	}
	arrowsInit(position){
		const _ = this;
		let
			prev = _.sliders[position]['slider'].querySelector('.slider-prev'),
			next = _.sliders[position]['slider'].querySelector('.slider-next');
		if (!prev) return;
		prev.disabled = true;
		prev.setAttribute('data-position',position);
		next.setAttribute('data-position',position);
		_.sliders[position]['prev'] = prev;
		_.sliders[position]['next'] = next;
	}


	define(){
		const _ = this;
		_.set({})
	}
	init(){
		const _ = this;
		_.slidersInit();

		let curRes = _.getResolution();
		window.addEventListener('resize',()=>{
			let winWidth = window.innerWidth;
			if (winWidth < _.resolutions[curRes][0] || winWidth > _.resolutions[curRes][1]) {
				curRes = _.getResolution();
				_.slidersInit();
				console.log('test')
			}
		})
	}
}
new Front();
