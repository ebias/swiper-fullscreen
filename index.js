var swiper = require('swiper');
var dialog = require('dialog-component');
var extend = require('deep-extend');
var domify = require('domify');
var css = require('mucss/css');
var sliderHTML = require('./index.html');
var itemHTML = require('./item.html');
var q = require('queried');

function SwiperFullscreen(options) {

	if (!(this instanceof(SwiperFullscreen))) return new SwiperFullscreen(options);

	var self = this;

	extend(self, options);

	self.el = domify(sliderHTML);

	//create and append slides
	self.data.forEach(function(itemData) {
		var item = self.render(itemData);
		self.appendItem(item);
	});

	if (self.navigation && self.data.length > 1) {
		self.appendNavigation();
	}

	//prepare and open dialog with swiper
	self.dialog = dialog(null, self.el)
	.effect('fade')
	.overlay()
	.fixed()
	.closable()
	.escapable()
	.addClass('dialog-slider-fullscreen')
	.on('show', function () {

		self.swiper = new Swiper(q('.swiper-container', self.el), self.swiper);
		css(document.body, {
			'overflow': 'hidden'
		});

	})
	.show()
	.on('close', closeDialog)
	.on('hide', closeDialog)
	.on('escape', closeDialog);

	function closeDialog () {
		css(document.body, {
			'overflow': null
		});
	}

}

extend(SwiperFullscreen.prototype, {

	data: [],
	navigation: true,

	swiper: {
		loop: true,
		effect: 'fade',
		speed: 200,
		lazyLoading: true,
		preloadImages: false,
		lazyLoadingOnTransitionStart: true,
		keyboardControl: true
	},

	render: function(data) {
		data.title = data.title || '';
		return domify(
			itemHTML
				.replace("%src%", data.src)
				.replace("%title%", data.title)
		);
	},

	appendItem: function(element) {
		this.el.querySelector('.swiper-wrapper').appendChild(element);
	},

	appendNavigation: function() {
		var self = this;

		//create elements for nav buttons
		var prevArrow = document.createElement('div');
		prevArrow.className = 'swiper-button-prev';
		var nextArrow = document.createElement('div');
		nextArrow.className = 'swiper-button-next';

		//bind click events
		prevArrow.addEventListener('click', function() {
			self.swiper.slidePrev();
		});
		nextArrow.addEventListener('click', function() {
			self.swiper.slideNext();
		});

		//append the buttons
		var container = q('.swiper-container', this.el);
		container.appendChild(prevArrow);
		container.appendChild(nextArrow);
	}

});

module.exports = SwiperFullscreen;