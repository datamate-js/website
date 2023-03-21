/**
*
*	MUCSV.js
*	2020 Scripted by T.Mashimo
*
*/

class MUCSV
{
	constructor()
	{
		this.fields = [];
		this.headers = [];
		this.rows = new Map();
		this.columns = new Map();
		this.filePaths = [];
		this.isAvailable = false;
		this.callback = null;
		this.comma = "&TEXT_COMMA;";
		this.LF = "&TEXT_LF;";
	}

	clear()
	{
		this.fields = [];
		this.filePaths = [];
	}

	value(_rowKey, _colKey)
	{
		const rowIndex = (typeof(_rowKey)=='string') ? this.indexOfRow(_rowKey) : _rowKey;
		const colIndex = (typeof(_colKey)=='string') ? this.indexOfColumn(_colKey) : _colKey;
		return this.fields[rowIndex][colIndex];
	}

	valueInRow(_row, _colKey)
	{
		const index = (typeof(_colKey)=='string') ? this.indexOfColumn(_colKey) : _colKey;
		const value = _row[index].replace(/&TEXT_COMMA;/g, ",").replace(/&TEXT_LF;/g, "\n");
		return value;

	}

	valueInColumn(_column, _rowKey)
	{
		const colIndex = (typeof(_rowKey)=='string') ? this.indexOfRow(_rowKey) : _rowKey;
		const value = _column[colIndex].replace(/&TEXT_COMMA;/g, ",").replace(/&TEXT_LF;/g, "\n");
		return valueZ;
	}

	indexOfRow(_rowKey)
	{
		const keys = Array.from(this.rows.keys());
		return keys.indexOf(_rowKey);
	}

	indexOfColumn(_columnKey)
	{
		const keys = Array.from(this.columns.keys());
		return keys.indexOf(_columnKey);
	}

	column(_key)
	{
		return this.columns.get(_key);
	}

	row(_key)
	{
		return this.rows.get(_key);
	}

	columnAtIndex(_index)
	{
		const keys = Array.from(this.columns.keys());
		const key = keys[_index];
		return this.column(key);
	}

	rowAtIndex(_index)
	{
		const keys = Array.from(this.rows.keys());
		const key = keys[_index];
		return this.row(key);
	}

	columnFromRowValue(_rowKey, _value)
	{
		const row = this.row(_rowKey);
		const index = row.indexOf(_value);
		return this.columnAtIndex(index);
	}

	rowFromColumnValue(_columnKey, _value)
	{
		const column = this.column(_columnKey);
		const index = column.indexOf(_value);
		return this.rowAtIndex(index);
	}

	count()
	{
		return this.filePaths.length;
	}

	addFilePath(_filePath)
	{
		this.filePaths.push(_filePath);
	}

	loadSync()
	{
		// Load all as synchronous connection. //
		for (let i=0; i<this.filePaths.length; i++) {
			const filePath = this.filePaths[i];					// Extract a file path
			const xmlHttpRequest = new XMLHttpRequest();
			xmlHttpRequest.open('get', filePath, false);
			xmlHttpRequest.setRequestHeader('Content-Type', 'text/plane');
			xmlHttpRequest.send(null);
			let responseText = xmlHttpRequest.responseText;		// Extract text data from response.
			this.parse(responseText);							// Parse and add them into fields.
			// console.log("MUCSV: Loaded Sync:", filePath, "\n", responseText);
		}

		// Loading complete //
		this.isAvailable = true;
		console.log("MUCSV: Load Completed (sync):", );

		// Call function if the callback is set. //
		if (this.callback)
			this.callback();
	}

	async load()
	{
		// Load all as asynchronous connection. //
		for (let i=0; i<this.filePaths.length; i++) {
			const filePath = this.filePaths[i];					// Extract a file path
			const response = await fetch(filePath);				// Fetch given file response.
			let responseText = await response.text();			// Extract text data from response.
			this.parse(responseText);							// Parse and add them into fields.
			// console.log("MUCSV: Loaded (async):", filePath, response);
		}

		// Loading complete //
		this.isAvailable = true;
		console.log("MUCSV: Load Completed (async):");

		// Call function if the callback is set. //
		if (this.callback)
			this.callback();
	}

	parse(_text)
	{
		// Store the start time for calculating the cost of time to parse. //
		const startTime = performance.now();

		// Replace CR/LF with temporary '&LF;' delimiter. //
		let text = _text.replace(/(\r\n)|(\r)|(\n)/g, "&LF;");	
		
		// Replace '&LF;' and ',' in quotes with single space ' ' only. //
		text = text.replace(/(\\"(.*?)\\")|("(.*?)")|(\\'(.*?)\\')|('(.*?)')/g, (_match)=>{
			//console.log("MUCSV: --", _match);
			let subtext = _match.replace(/&LF;/g, this.LF);
			subtext = subtext.replace(/,/g, this.comma);
			return subtext;
		});

		// Replace quotes as blank. //
		text = text.replace(/"|'/g, "");

		// Split remained '&LF;' that are data field delimiters, and split commnas. //
		const fields = text.split("&LF;");

		// Extract headers //
		this.headers = fields[0].split(",");

		// Create columns //
		this.columns = new Map();
		for (let i=0; i<this.headers.length; i++) 
			this.columns.set(this.headers[i], []);

		// Split values and map them to map. //
		this.rows = new Map();
		for (let i=0; i<fields.length; i++) {
			let field = fields[i];
			// field = field.replace("  ", "\n");
			const values = field.split(",");
			console.log(values);
			this.fields.push(values);

			// Set row //
			this.rows.set(values[0], values);

			// Set column //
			for (let ii=0; ii<values.length; ii++) {
				const header = this.headers[ii];
				const value = values[ii];
				const column = this.columns.get(header);
				column.push(value);
			}
		}

		// Calculate elpased time. //
		const elapsedTime = performance.now() - startTime;
		console.log("MUCSV: parsed:", elapsedTime, "ms");

		// Show result in console. //
		console.table(this.fields);
	}
}
