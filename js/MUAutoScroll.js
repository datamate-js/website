	/*
*
*	MUAutoScroll.js
*	2019 Scripted by Takehisa Mashimo
*	ver1.0.0
*
*/

(window.addEventListener) ? window.addEventListener("load", MUAutoScrollHandler, false) : window.attachEvent("onload", MUAutoScrollHandler);

// Auto Loading Setting //
function MUAutoScrollHandler()
{
	// Extract hash for scroll when open page //
	var hash = (window.location.hash) ? window.location.hash : null;
	//location.hash = "";

	var instances = new Array();
	var elements = window.document.querySelectorAll("a[data-mu-autoscroll]");
	for (var i=0; i<elements.length; i++) {
		var element = elements[i];
		var attributes = element.getAttribute("data-mu-autoscroll");
		var options = null;
		try {
			options = JSON.parse(attributes);
			console.log("MUAutoScroll: Options.", attributes, options);
		} catch (e) {
			options = new Object();
			console.log("MUAutoScroll: Parameter Parse Error.", attributes, options);
		}

		options.hash = hash;
		var instance = new MUAutoScroll(element, options);
		instances.push(instance);
	}
}

class MUAutoScroll
{
	constructor(_element, _options)
	{
		this.version = "1.0.0";
		this.element = _element;
		this.options = _options;
		this.hash = (_options.hash) ? _options.hash : null;
		//this.targetSelector = (_options.target) ? _options.target : null;
		this.easeType = (_options.easetype) ? _options.easetype : "easeinout";
		this.offset = (_options.offset) ? _options.offset : 0;
		this.duration = (_options.duration) ? _options.duration * 1000 : 0.7 * 1000;
		this.scrollImmediately = false;
		this.targetElement = null;
		this.fader = null;

		// Extract a selector from anchor href attribute. //
		var selector = this.element.href.split("#");
		selector = (selector.length > 1) ? "#" + selector.pop() : "";
		this.targetSelector = selector;

		// Extract target element from extarcted selector. //
		this.targetElement = window.document.querySelector(this.targetSelector);

		// Prepare fader for scroll animation //
		this.fader = new MUAutoScrollFader(this.faderCallback.bind(this), this.easeType);

		// Add mousedown event listener //
		this.element.addEventListener("mousedown", function(e) {
			e.preventDefault();
			e.stopPropagation();
			this.startScroll();
			return false;
		}.bind(this), false);
		this.element.addEventListener("click", function(e) {
			e.preventDefault();
			e.stopPropagation();
			//window.location.href = this.element.href;
			return false;
		}.bind(this), false);

		// When current location has a hash, means jumped from the other page, scroll immediately. //
		if (this.hash!=null && this.hash==this.targetSelector)
			this.startScroll();
	}

	startScroll()
	{
		var currentScrollTop = this.currentScrollTop();
		//var targetScrollTop = this.targetElement.offsetTop + this.offset;
		var targetScrollTop = this.targetElement.getBoundingClientRect().top + window.pageYOffset + this.offset;
		this.fader.restart(currentScrollTop, targetScrollTop, this.duration, this.easetype);
		console.log("MUAutoScroll:start", currentScrollTop, targetScrollTop, this.targetElement);
	}

	// ScrollTop reference elements is different from Firefox, IE (html element) and others (body element) //
	// For moving scroll, we should use window.scrollTo(x, y) that is avalable all browser.
	currentScrollTop()
	{
		var scrollElements = window.document.querySelectorAll("html, body");
		var scrollTop = 0;
		for (var i=0; i<scrollElements.length; i++)
			scrollTop = Math.max(scrollTop, scrollElements[i].scrollTop);	// The invalid scrollTop will be always 0
		return scrollTop;
	}

	faderCallback()
	{
		window.scrollTo(0, this.fader.currentValue());
	}
}


class MUAutoScrollFader
{
	static timeInterval = null;

	constructor(_callback, _easeType)
	{
		this.version = "1.0.0";
		this.startValue = 0.0;
		this.endValue = 1.0;
		this.duration = 1000;
		this.progress = 0.0;
		this.easeIndex = 2.0;
		this.easeType = (_easeType) ? _easeType : "line";

		this.date = null;
		//this.timeInterval = null;
		this.callback = _callback;
	}

	restart(startValue, endValue, duration)
	{
		this.startValue = startValue;
		this.endValue = endValue;
		this.duration = duration;
		this.date = new Date();
		if (MUAutoScrollFader.timeInterval)
			clearInterval(MUAutoScrollFader.timeInterval);
		MUAutoScrollFader.timeInterval = setInterval(this.intervalCallback.bind(this), 1000/60.0);
	}

	intervalCallback()
	{
		const currentDate = new Date();
		const elapsedTime = (currentDate.getTime() - this.date.getTime()) * 1.0;
		this.progress = Math.max(0.0, Math.min(1.0, (elapsedTime / this.duration)));

		switch (this.easeType) {
			case "liner":
				break;
			case "easein":
				this.progress = Math.pow(this.progress, this.easeIndex);
				break;
			case "easeout":
				this.progress = 1.0 - Math.pow((1.0 - this.progress), this.easeIndex);
				break;
			case "easeinout":
				this.progress = (this.progress < 0.5) ? Math.pow(this.progress * 2, this.easeIndex) * 0.5 : 1.0 - (Math.pow((1.0 - this.progress) * 2, this.easeIndex) * 0.5);
				break;
		}
		//console.log(this.easeType, this.progress);

		if (this.progress==1.0) {
			clearInterval(MUAutoScrollFader.timeInterval);
			MUAutoScrollFader.timeInterval = null;
		}

		if (this.callback)
			this.callback();
	}

	currentValue()
	{
		return (this.endValue - this.startValue) * this.progress + this.startValue;
	}
}
