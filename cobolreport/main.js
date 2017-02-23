
function textAreaAdjust(o) {
  o.style.height = "1px";
  o.style.height = (o.scrollHeight)+"px";
}

function rightPad(str, pad, len) {
	for (var i = str.length; i < len; i++) str += pad;
	return str;
}

function repeat(str, times) {
	var output = "";
	for (var i = 0; i < times; i++) output += str;
	return output;
}

function writeCobolContent(indent, level, name, value, length, editField) {
	var words, output = "", tmp = "";
	if (!length && value.length != 0) { // this is not filler
		if (value.length <= 15) {
			return writeCobolContent(indent, level, name, '"' + value + '"', value.length);
		} else {
			words = value.match(/\w+\W*/g);
			for (var i = 0; i < words.length; i++) {
				if (tmp.length + words[i].length > 15) {
					output += writeCobolContent(indent, level, name, '"' + tmp + '"', tmp.length);
					tmp = "";
				}
				tmp += words[i];
				while (tmp.length > 15) {
					output += writeCobolContent(indent, level, name, '"' + tmp.substr(0, 15) + '"', 15);
					tmp = tmp.substr(15);
				}
			}
			if (tmp.length) output += writeCobolContent(indent, level, name, '"' + tmp + '"', tmp.length);
		}
	} else {
		output += repeat(' ', indent);
		output += ((level < 10) ? "0" : "") + level;
		output += "  " + rightPad(name, ' ', 19) + " ";
		if (!editField) {
			output += "VALUE " + rightPad(value, ' ', 17);
			output += " PIC X(" + ((length < 10) ? "0" : "") + length + ")";
		} else {
			output += repeat(' ', 23);
			output += " PIC ";
			if (editField.length > 11) output += "\n" + repeat(' ', 52);
			output += editField;
		}
		output += '.\n';
	}
	return output;
}

function makeReport(input, width) {
	var row, col, widths, spacings;
	var content, baseSpace, extraSpace, contentWidth;
	var space;
	var test = "";
	var cobol = "";
	var i, j, k, l;
	var outputChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var outRowNum = 0;
	input = input.split('\n---\n');
	for (i = 0; i < input.length; i++) {
		row = input[i].split('\n-\n');
		content = [];
		widths = [];
		for (j = 0; j < row.length; j++) {
			if (widths.length <= j) widths.push(0);
			col = row[j].split('\n');
			while (content.length < col.length) content.push([]);
			for (k = 0; k < col.length; k++) {
				if (col[k].length == 0) continue; // skip empty values
				l = {col: j};
				if (col[k].charAt(0) == '>' && col[k].charAt(1) != '>') {
					l.val = col[k].substr(1);
					l.isField = true;
				} else {
					l.val = col[k];
					l.isField = false;
				}
				content[col.length-1-k].push(l);
				widths[j] = Math.max(widths[j], col[k].length);
			}
		}
		
		spacings = [0];
		contentWidth = 0;
		for (j = 0; j < widths.length; j++) contentWidth += widths[j];
		baseSpace = Math.floor((width-contentWidth) / (widths.length - 1));
		extraSpace = (width-contentWidth) % (widths.length - 1);
		for (j = 1; j < widths.length; j++) {
			if (j >= widths.length - extraSpace) spacings.push(baseSpace+1);
			else spacings.push(baseSpace);
		}
		
		for (k = 0; k < content.length; k++) {
			l = 0;
			row = content[content.length-1-k];
			space = 0;
			if (widths.length == 1) {
				row[0].preSpace = Math.floor((width-row[0].val.length)/2);
			} else {
				for (j = 0; j < widths.length; j++) {
					space += spacings[j];
					if (j == row[l].col) {
						row[l].preSpace = space + Math.floor((widths[j]-row[l].val.length)/2);
						space = widths[j] - Math.floor((widths[j]-row[l].val.length)/2) - row[l].val.length;
						l++;
						if (l >= row.length) break;
					} else {
						space += widths[j];
					}
				}
			}
		}
		
		for (k = 0; k < content.length; k++) {
			cobol += "03  rh-0" + outputChars[outRowNum] + ".\n";
			row = content[content.length-1-k];
			for (j = 0; j < row.length; j++) {
				for (l = 0; l < row[j].preSpace; l++) test += ' ';
				if (row[j].preSpace > 0) {
					cobol += writeCobolContent(4, 5, 'FILLER', 'SPACES', row[j].preSpace);
				}
				
				test += row[j].val;
				if (row[j].isField) {
					cobol += writeCobolContent(4, 5, 'RL-0' + outputChars[outRowNum], '', 0, row[j].val);
				} else {
					cobol += writeCobolContent(4, 5, 'RL-0' + outputChars[outRowNum], row[j].val);
				}
			}
			test += "\n";
			outRowNum++;
		}
	}
	
	document.getElementById("output").innerHTML = cobol;
	document.getElementById("preview").innerHTML = test;
	
}

window.addEventListener("load", function () {
	textAreaAdjust(document.getElementById("spec"));
	document.getElementById("doStuff").addEventListener("click", function() {
		makeReport(
			document.getElementById("spec").value,
			document.getElementById("width").value);
	});
});
