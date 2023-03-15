
class SampleManager
{
    constructor()
    {
        this.overlayElement = window.document.querySelector("#overlay");
        this.overlayElement.addEventListener("mousedown", function(_e) {
            this.closeSampleView();
        }.bind(this));

        this.previewElement = window.document.querySelector("#preview");
        this.previewElement.addEventListener("transitionstart", function (_e) {
            if (this.previewElement.style.opacity > 0.0)
                this.previewElement.style.visibility = "visible";
        }.bind(this));
        this.previewElement.addEventListener("transitionend", function (_e) {
            if (this.previewElement.style.opacity==0.0)
                this.previewElement.style.visibility = "hidden";
        }.bind(this));

        this.codeElement = window.document.querySelector("#code");
        this.codeElement.addEventListener("transitionstart", function (_e) {
            if (this.codeElement.style.opacity > 0.0)
                this.codeElement.style.visibility = "visible";
        }.bind(this));
        this.codeElement.addEventListener("transitionend", function (_e) {
            if (this.codeElement.style.opacity==0.0)
                this.codeElement.style.visibility = "hidden";
        }.bind(this));

        this.switcherElement = window.document.querySelector("#switcher");
        this.switcherElement.isPreview = true;
        this.switcherElement.addEventListener("mousedown", function (_e) {
            this.switcherElement.isPreview = !this.switcherElement.isPreview;
            // this.previewElement.style.opacity = (this.switcherElement.isPreview) ? 1.0 : 0.0;
            this.codeElement.style.opacity = (this.switcherElement.isPreview) ? 0.0 : 1.0;
            this.switcherElement.innerHTML = (this.switcherElement.isPreview) ? "CODE" : "PREVIEW";
        }.bind(this));

        this.sampleViewElement = window.document.querySelector("#sample-viewer");
        this.sampleViewElement.addEventListener("transitionend", function (_e) {
            this.sampleViewElement.style.visibility = (this.sampleViewElement.style.opacity==0.0) ? "hidden" : "visible";
            if (this.sampleViewElement.style.opacity==0.0) {
                this.switcherElement.isPreview = true;
                this.previewElement.style.opacity = 0;
                this.codeElement.style.opacity = 0;
            }
        }.bind(this));
    }

    async reload()
    {
        // Load sample codes. //
        const sampleElements = window.document.querySelectorAll("[data-sampleviewer]");
        for (let i=0; i<sampleElements.length; i++) {
            const sampleElement = sampleElements[i];
            const loader = new SampleLoader(this, sampleElement);
            await loader.load();
            console.log("SampleManager: Load: ", i, sampleElements.length);
        }

        // Add Prism.js after loading all sample codes. //
        const prismElement = window.document.createElement("script");
        prismElement.src = "prism/prism.js";
        window.document.body.appendChild(prismElement);
    }
    
    openSampleView(_samplePath, _codeHTML)
    {
        const src = _samplePath;
        this.previewElement.src = src;
        
        this.sampleViewElement.style.visibility = "visible";
        this.sampleViewElement.style.opacity = 1.0;

        this.switcherElement.isPreview = true;
        this.switcherElement.innerHTML = "CODE";

        this.previewElement.style.opacity = 1.0;
        this.codeElement.style.opacity = 0.0;
        this.codeElement.innerHTML = _codeHTML;
    }

    closeSampleView()
    {
        this.sampleViewElement.style.opacity = 0.0;
        this.previewElement.src = "";
    }
}

class SampleLoader
{
    constructor(_manager, _element)
    {
        this.manager = _manager;
        this.element = _element;
        this.samplePath = _element.getAttribute("data-sampleviewer");
        this.codeElement = _element.querySelector("code");
        this.runButtonElement = _element.querySelector("[data-sampleviewer-button]");
        if (this.runButtonElement)
		    this.runButtonElement.addEventListener("mousedown", this.runClickHandler.bind(this));
        this.isLoadComplete = false;
    }

    async load()
    {
        const response = await fetch(this.samplePath);			// Fetch sample html path
        const responseText = await response.text();			// Extract text data from response.
        const parser = new DOMParser();
        const dom = parser.parseFromString(responseText, "text/html");
        const scriptElement = dom.querySelector("body > script:nth-of-type(1)");
        const code = this.escape(scriptElement.innerHTML);
        console.log(code);

        // If the code element is null, create a new element to reflect prism conversion. //
        if (this.codeElement==null) {
            this.codeElement = window.document.createElement("code");
            this.codeElement.style.display = "none";
            window.document.body.appendChild(this.codeElement);
        }
        this.codeElement.innerHTML = code;
        this.codeElement.classList.add("language-javascript");

        this.isLoadComplete = true;
        console.log("index.js: Loaded:", this.samplePath, scriptElement);
    }

    runClickHandler(_e)
    {
        this.manager.openSampleView(this.samplePath, this.codeElement.innerHTML);
        //openCodeView(src);
    }

    escape(_string)
    {
        return _string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}