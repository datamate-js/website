class ReferenceManager
{
    constructor()
    {
        // Prepare viewer actions. //
        this.viewer = window.document.querySelector("#reference-viewer");
        this.viewer.style.position = "fixed";
        this.viewer.style.visibility = 'hidden';
        this.viewer.style.opacity = 0;
        this.viewer.style.zIndex = 999;
        this.viewer.style.transition = "opacity 0.5s";
        this.viewer.addEventListener("transitionstart", function() {
            this.viewer.style.visibility = 'visible';
        }.bind(this));
        this.viewer.addEventListener("transitionend", function() {
            if (this.viewer.style.opacity==0)
                this.viewer.style.visibility = 'hidden';
        }.bind(this));

        // Create overlay //
        this.overlayElement = window.document.createElement("div");
        this.overlayElement.style.position = "fixed";
        this.overlayElement.style.left = "0px";
        this.overlayElement.style.top = "0px";
        this.overlayElement.style.width = "100%";
        this.overlayElement.style.height = "100%";
        this.overlayElement.style.padding = "0";
        this.overlayElement.style.margin = "0";
        this.overlayElement.style.backgroundColor = "rgba(0,0,0,0.7)";
        this.overlayElement.addEventListener("mousedown", function() {
            this.close();
        }.bind(this));

        // Append overlay into viewer. //
        this.viewer.insertBefore(this.overlayElement, this.viewer.firstChild);

        // Start load CSV //
        this.csv = new MUCSV();
        this.csv.addFilePath("./reference/reference.csv");
        this.csv.callback = this.csvLoadComplete.bind(this);
        this.csv.load();
    }

    csvLoadComplete()
    {
        console.log("ReferenceManager: csv loaded.");

        const headerField = this.csv.fields[0];

        const liElements = window.document.querySelectorAll("[data-ref-manager]");
        for (let i=0; i<liElements.length; i++) {
            const element = liElements[i];
            const objectName = element.getAttribute("data-ref-manager");
            const row = this.csv.rowFromColumnValue("Object", objectName);
            element.row = row;
            element.addEventListener('mousedown', function(_e) {
                this.open(_e.currentTarget.row);
            }.bind(this));
            console.log("ReferenceManager:", objectName, row);
        }
    }

    open(_row)
    {
        const tableElement = window.document.querySelector("#reference-table");
        const h2 = window.document.querySelector("#reference-viewer h2");
        const descElement = tableElement.querySelector("tr:nth-of-type(1) td:nth-of-type(2)");
        const typeElement = tableElement.querySelector("tr:nth-of-type(2) td:nth-of-type(1)");
        const funcElement = tableElement.querySelector("tr:nth-of-type(2) td:nth-of-type(2)");
        const argsElement = tableElement.querySelector("tr:nth-of-type(3) td:nth-of-type(2)");
        const returnElement = tableElement.querySelector("tr:nth-of-type(4) td:nth-of-type(2)");

        const type = this.csv.valueInRow(_row, "type2");
        const args = this.csv.valueInRow(_row, "args");
        const argsA = args.split("  ");
        const argsB = args.replace(/  /g, ", ");
        const argexps = this.csv.valueInRow(_row, "arg-explanations").split("  ");
        const defaults = this.csv.valueInRow(_row, "arg-defaults").split("  ");
        let argtexts = (argsA=="") ? "なし" : "";
        if (argsA!="") { 
            for (let i=0; i<argsA.length; i++) {
                argtexts += argsA[i];
                argtexts += " : ";
                argtexts += argexps[i];
                if (i < defaults.length && defaults[i]!="")
                    argtexts += '（省略可。デフォルトは' + defaults[i] + "）";
                argtexts += "<br>";
            }
        }
        const desc = this.csv.valueInRow(_row, "description");
        const valReturn = this.csv.valueInRow(_row, "return");

        h2.innerHTML = this.csv.valueInRow(_row, "Object") + ((type=="method") ? `(${argsB})` : "");
        typeElement.innerHTML = (type=="method") ? "メソッド" : "プロパティ";
        funcElement.innerHTML = this.csv.valueInRow(_row, "Object") + ((type=="method") ? `(${argsB})` : "");
        argsElement.innerHTML = argtexts;
        returnElement.innerHTML = (valReturn=="") ? "なし" : valReturn;
        descElement.innerHTML = desc;

        this.viewer.style.opacity = 1.0;
        console.log(_row);
    }

    close()
    {
        this.viewer.style.opacity = 0.0;
    }
}