	/*
*
*	MUListDrawer.js
*	2019 Scripted by Takehisa Mashimo
*	ver1.0.0
*
*/

(window.addEventListener) ? window.addEventListener("load", MUListDrawerHandler, false) : window.attachEvent("onload", MUListDrawerHandler);

// Auto Loading Setting //
function MUListDrawerHandler()
{
	// Extract hash for scroll when open page //
	var hash = (window.location.hash) ? window.location.hash : null;
	//location.hash = "";

	var instances = new Array();
	var elements = window.document.querySelectorAll("[data-mu-listdrawer]");
	for (var i=0; i<elements.length; i++) {
		var element = elements[i];
		var attributes = element.getAttribute("data-mu-listdrawer");
		var options = null;
		try {
			options = JSON.parse(attributes);
			console.log("MUListDrawer: Options.", attributes, options);
		} catch (e) {
			options = new Object();
			console.log("MUListDrawer: Parameter Parse Error.", attributes, options);
		}

		options.hash = hash;
		var instance = new MUListDrawer(element, options);
		instances.push(instance);
	}
}

class MUListDrawer
{
	constructor(_element, _options)
	{
		this.version = "1.0.0";
		this.element = _element;
		this.targetQuery = _options.target;
		this.duration = (_options.duration) ? _options.duration : 0.5;
		this.listElement = window.document.querySelector(this.targetQuery);

		this.isOpen = false;
		this.close();

		this.element.style.cursor = "pointer";
		this.element.addEventListener("mousedown", this.toggle.bind(this));

		this.listElement.style.overflowY = 'hidden';
		this.listElement.style.transition = "all " + this.duration + "s ease-in-out";
	}

	toggle(_e)
	{
		(this.isOpen) ? this.close() : this.open();
	}

	open()
	{
		this.listElement.style.maxHeight = "100%";
		this.listElement.style.margin = "";
		//this.listElement.style.padding = "";
		this.isOpen = true;
	}

	close()
	{
		this.listElement.style.maxHeight = 0;
		//this.listElement.style.margin = 0;
		//this.listElement.style.padding = 0;
		this.isOpen = false;
	}
}
