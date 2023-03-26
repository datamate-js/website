/**
*
*	MUScrollFader.js
*	2020 Scripted by T.Mashimo
*	ver1.0.0
*
*/

(window.addEventListener) ? window.addEventListener("load", MUScrollFaderLoadHandler, false) : window.attachEvent("load", MUScrollFaderLoadHandler);

// Auto Loading Setting //
function MUScrollFaderLoadHandler()
{
	var instances = new Array();
	var elements = window.document.querySelectorAll("[data-mu-scrollfader]");
	for (var i=0; i<elements.length; i++) {
		var element = elements[i];
		var attributes = element.getAttribute("data-mu-scrollfader");
		var options = null;
		try {
			options = JSON.parse(attributes);
			console.log("MUScrollFader: Options.", attributes, options);
		} catch (e) {
			options = new Object();
			console.log("MUScrollFader: JSON Parse Error: No Available Options.", attributes, options);
		}
		var instance = new MUScrollFader(element, options);
		instances.push(instance);
	}
}

class MUScrollFader
{
	constructor(_element, _options)
	{
		this.element = _element;
		this.options = _options;
		this.offsetX = (_options.offsetX!==undefined) ? _options.offsetX : 0;
		this.offsetY = (_options.offsetY!==undefined) ? _options.offsetY : 50;
		this.duration = (_options.duration!==undefined) ? _options.duration * 1000 : 1.0 * 1000;
		this.isOnce = (_options.once!==undefined) ? _options.once : true;	//ver1.0.1, once option
		this.delay = (_options.delay) ? _options.delay * 1000 : 0;
		this.element.style.opacity = 0;
		this.element.style.transform = "translate(" + this.offsetX + "px, " + this.offsetY + "px)";

		this.prepare();

		// this.styleStorage = {};		// For store current element transition state.
		// this.isVisible = false;

		// // Call update when view is scrolled. //
		// window.addEventListener("scroll", this.update.bind(this), false);

		// Call after 0.1s at once for updating after loading html. // 
		setTimeout(this.update.bind(this), 100);
	}

	prepare()
	{
		this.styleStorage = {};		// For store current element transition state.
		this.isVisible = false;
		this.element.style.opacity = 0;
		this.element.style.transform = "translate(" + this.offsetX + "px, " + this.offsetY + "px)";
		window.addEventListener("scroll", this.update.bind(this), false);	// Call update when view is scrolled. //
	}

	update()
	{
		const scrollTop = this.scrollTop();
		var elementPosition = this.element.getBoundingClientRect().top;
		if (elementPosition < window.innerHeight && this.element.style.opacity==0 && !this.isVisible) {
			this.isVisible = true;
			setTimeout(this.show.bind(this), this.delay);
		}
		if (!this.isOnce && elementPosition > window.innerHeight && this.element.style.opacity==1 && this.isVisible) {
			this.prepare();
		}
	}

	show()
	{
		this.styleStorage.transition = this.element.style.transition;

		this.element.style.opacity = 1;
		this.element.style.transition = this.duration + "ms";
		this.element.style.transform = "translate(0px, 0px)";
		this.element.addEventListener("transitionend", this.disable.bind(this));
		window.removeEventListener("scroll", this.update.bind(this), false);
	}

	disable()
	{
		this.element.style.transition = this.styleStorage.transition;
		this.element.style.transform = "";
	}

	scrollTop()
	{
		var scrollElements = window.document.querySelectorAll("html, body");
		var scrollTop = Math.max(0, this.element.scrollTop);	// The invalid scrollTop will be always 0
		return scrollTop;
	}
}
