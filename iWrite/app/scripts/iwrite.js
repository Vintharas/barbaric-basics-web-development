(function (iwrite) {
    'use strict';
    var fileNames,
        KEY_FILENAMES = 'fileNames',
        DOM = iwrite.DOM,
        markdownParser = new Worker('scripts/markdownParser.js');

    markdownParser.onmessage = handleParsedHtml;

    window.addEventListener('load', initialize);
    
    function initialize() {
        var addImageBtn = document.getElementById('add-image');
        addImageBtn.addEventListener('click', addImage);
        var addFileBtn = document.getElementById('add-file');
        addFileBtn.addEventListener('click', addFile);
        loadExistingFiles( );
    }

    function addImage() {
       // add image and paint with canvas and svg or something like that 
    }

    function loadExistingFiles() {
        fileNames = iwrite.localStorage.getItem(KEY_FILENAMES) || [];
        DOM.loadFilesInSidebar(fileNames, /* onClickFile */ openFile);
    }

    function addFile() {
        var newFileNameTemplate = 'New File ',
            newFileName = 'New File 1',
            counter = 1;
        while (filenameAlreadyExists(newFileName)) {
            counter++;
            newFileName = newFileNameTemplate + counter.toString();
        }

        fileNames.push(newFileName); // TODO: sort alphabetically

        iwrite.localStorage.setItem(KEY_FILENAMES, fileNames);
        iwrite.localStorage.setItem(newFileName, {name: newFileName, content: 'Start writing here in markdown...'});

        DOM.loadFilesInSidebar(newFileName, /* onClickFile */ openFile);

        function filenameAlreadyExists(newFileName) {
            return fileNames.some(function(fileName) { return newFileName === fileName; });
        }
    }

    function openFile() {
        var fileName = this.text;
        DOM.setFileListItemAsActive(this);
        this.className = 'list-group-item active';
        console.log('opening file: ' + fileName);
        var file = iwrite.localStorage.getItem(fileName);
        loadContent(file.content);
        loadPreview(file.content);
    }

    function loadContent(fileContent) {
        console.log('Open editor with content: ' + fileContent);
        var editor = DOM.getOrCreateEditor(/* onReloadPreview */ computePreview);
        editor.value = fileContent;
    }

    function loadPreview(fileContent) {
        DOM.getOrCreatePreview();
        computePreview(fileContent);
    }

    function computePreview(fileContent) {
        console.log('sending data to worker: ', fileContent);
        markdownParser.postMessage(fileContent);
    }

    function handleParsedHtml(e) {
        var parsedHtml = e.data;
        console.log('received data from worker: ', parsedHtml);
        DOM.setPreviewContent(parsedHtml);
    }

}(window.iwrite = window.iwrite || {}));

