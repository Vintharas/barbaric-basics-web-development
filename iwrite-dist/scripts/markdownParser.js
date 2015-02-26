'use strict';
/*

Parses markdown into html

*/
onmessage = function (event) {
    console.log('Worker: Message received from main script');
    var fileContent = event.data,
        markdownIterator = iterator(fileContent),
        pieces = [],
        nextPiece,
        processedLines,
        parsedHtml;

    console.log('Worker: Content to parse: ', fileContent);
    while (nextPiece = markdownIterator()) {
        pieces.push(nextPiece);
    }
    processedLines = pieces.map(processPiece);
    parsedHtml = processedLines.join('');
    console.log('Worker: Posting message back to main script');
    postMessage(parsedHtml);
}

function iterator(markdownFile) {
    var subIterators = [
        {
            name: 'list',
            isValidIterator: function(content) {
                return content.startsWith("* ") //  unordered list
                    || content.startsWith("- ") //  unordered list
                    || content.startsWith(/^\d\.\s*/); // ordered list
            },
            getNext: function(content) {
                var nextPiece = '',
                    line = grabMeALine(content);
                while (this.isValidIterator(line)) {
                    nextPiece = nextPiece.concat(line);
                    content = content.slice(line.length);
                    line = grabMeALine(content);
                }
                markdownFile = markdownFile.slice(nextPiece.length);
                return nextPiece;
            }
        },
        {
            name: 'one liner',
            isValidIterator: function () {
                return true;
            },
            getNext: function (content) {
                var nextPiece = grabMeALine(content);
                markdownFile = markdownFile.slice(nextPiece.length);
                return nextPiece;
            }
        }
    ];
    return function() {
        var iterator = subIterators
            .filter(function(it) {
             return it.isValidIterator(markdownFile);
        }, this)[0];
        console.log('Worker: Found suitable iterator -> ', iterator.name);

        if (!markdownFile) return;
        return iterator.getNext(markdownFile);
    }
}

function grabMeALine(content) {
    var indexOfNextNewLine = content.indexOf('\n'),
        line;
    if (indexOfNextNewLine === -1) {
        line = content;
    } else {
        line = content.slice(0, indexOfNextNewLine + 1);
    }
    return line;
}

function processPiece(line) {
    console.log('Worker: Processing line -> ', line);
    var matchers = getMatchers(),
        matcher,
        matchesInLine;
    
    var validMatchers = matchers.filter(function (matcher) {
        return matcher.regex.test(line);
    });
   
    if (validMatchers.length > 0) {
        matcher = validMatchers[0];
        console.log('Worker: Found active matchers -> ', matcher.name);
        var parsedLine = matcher.parse(line);
        console.log('Worker: Parsed markdown line into: ', parsedLine);
        return parsedLine;
    } else {
        console.log('Worker: No matcher found for :' + line);
    }
    return line;

}

function getMatchers() {
    return [
        {
            name: 'Unordered line',
            regex: /^(\*|\-)\s*((\w|\s)+)/,
            output: '<ul>{0}</ul>',
            perElementOutput: '<li>{0}</li>',
            parse: function(piece) {
                var formattedLines = [];
                var lines = piece.split('\n');
                lines.forEach(function(line) {
                    var matchesInLine = this.regex.exec(line);
                    formattedLines.push(this.perElementOutput.replace('{0}', matchesInLine[2]));
                }, this);
                return this.output.replace('{0}', formattedLines.join(''));
            }
        },
        {
            name: 'Header 2',
            regex: /^##\s((\w|\s)*)/,
            output: '<h2>{0}</h2>',
            parse: function(line) {
                var matchesInLine = this.regex.exec(line);
                return this.output.replace('{0}', matchesInLine[1]);
            }
        },

        {
            name: 'Header 1',
            regex: /^#\s((\w|\s)*)/,
            output: '<h1>{0}</h1>',
            parse: function(line) {
                var matchesInLine = this.regex.exec(line);
                return this.output.replace('{0}', matchesInLine[1]);
            }
        },
        {
            name: 'New Line or Only Whitespace',
            regex: /^\s*$/,
            output: '<br/>',
            parse: function(line) {
                return this.output;
            }
        },
        {
            name: 'Paragraph',
            regex: /\w*/,
            output: '<p>{0}</p>',
            parse: function(line) {
                return this.output.replace('{0}', line);
            }
        }
    ];
}

String.prototype.startsWith = function () {
    if (typeof arguments[0] === 'string') {
        return startWithText.call(this, arguments[0]);
    }
    return startWithRegEx.call(this, arguments[0]);

    function startWithText(text) {
        return text === this.slice(0, text.length);
    }
    function startWithRegEx(regEx) {
        return regEx.test(this);
    }
};