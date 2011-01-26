(function($) {

	var slides = [];
	var slidesWrapper; 
	var currentSlide;
	var currentSlideNumber = 0;
	var slideWidth;
	var totalWidth;
	var opts = [];

	$.fn.vlcarousel = function (options) {

		var defaults = {
			slideDelay: 1000,
			interval: 4000,
			easing: 'swing',
			effect: 'slide'
		};
		opts = $.extend(defaults, options);

		slidesWrapper = this.find('ul').first();
		if (!slidesWrapper) return;

		slides = slidesWrapper.children('li');
		if (slides.length < 1) return;

		// Sanity check. 
		if (opts.slideDelay > opts.interval) {
			alert('Slide delay cannot be greater than interval');
			return;
		}

		// We need css background images loaded before any calculations
		addListeners();
		autoScroll();
	}

	function setUpSlides() {

		slides.css({ float: 'left' });

		var slide = slides.first();
		slideWidth = slide.outerWidth(true);
		totalWidth = slideWidth * slides.length;

		slidesWrapper.width(totalWidth);

		if (opts.effect == 'fade') setUpFade();
	}
	
	function setUpFade() {
		$.each(slides, function(index, slide) { 
			$(slide).css({ float:'none', zIndex: index, position:'absolute' });
			if (index !== currentSlideNumber) {
				$(slide).hide();
			}
		});
	}

	function addListeners() {
		// We need css background images loaded before any calculations
		$(window).bind('load resize', function(e) {
			setUpSlides()
		});
	}

	function slide(slideNumber, speed) {

		var transitionSpeed = speed || opts.slideDelay;

		var offset = slideWidth * slideNumber;
		$(slidesWrapper).animate(
			{ left: -offset + "px" },
			transitionSpeed,
			opts.easing
		);

		updateCurrentSlide(slideNumber);
	}

	function fade(slideNumber, speed) {

		var transitionSpeed = speed || opts.slideDelay;
		var slide = $(slides[currentSlideNumber]);
		var nextSlide = $(slides[getNextSlideNumber()]);

		slide.fadeOut(transitionSpeed);
		nextSlide.delay(transitionSpeed / 15).fadeIn(transitionSpeed);

		updateCurrentSlide(slideNumber);
	}

	function updateCurrentSlide(slideNumber) {
		currentSlide = slides[slideNumber];
		currentSlideNumber = slideNumber;
	}

	function getNextSlideNumber() {
	
		var nextSlideNumber = currentSlideNumber + 1;

		if (nextSlideNumber >= slides.length) {
			nextSlideNumber = 0;
		}

		return nextSlideNumber;
	}

	function nextSlide() {

		var speed;
		var nextSlideNumber = getNextSlideNumber();

		if (nextSlideNumber >= slides.length) {
			speed = opts.speed / 7;
		}

		if (opts.effect == 'fade') {
			fade(nextSlideNumber, speed);
		} else {
			slide(nextSlideNumber, speed);
		}
	}

	function autoScroll() { 
		window.setInterval(function() {
			nextSlide();
		}, opts.interval);
	}
		
})(jQuery);
