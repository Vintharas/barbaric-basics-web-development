/*

Parses markdown into html

*/
onmessage = function (event) {
    console.log('Worker: Message received from main script');
    var fileContent = event.data;
    var lines = fileContent.split('\n');
    var processedLines = lines.map(processLine);
    var parsedHtml = processedLines.join('');
    console.log('Worker: Posting message back to main script');
    postMessage(parsedHtml);
}

function processLine(line) {
    console.log('Worker: Processing line -> ', line);
    var matchers = getMatchers(),
        matcher,
        matchesInLine;
    
    var validMatchers = matchers.filter(function (matcher) {
        return matcher.regex.test(line);
    });
   
    if (validMatchers.length > 0) {
        console.log('Worker: Found active matchers');
        matcher = validMatchers[0];
        var parsedLine = matcher.parse(line);
        console.log('Worker: Parsed markdown line into: ', parsedLine);
        return parsedLine;
    }
    return line;

}

function getMatchers() {
    return [
        {
            name: 'Header 1',
            regex: /^#\s(\w*)/,
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