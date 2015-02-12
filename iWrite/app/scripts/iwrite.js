(function (iwrite, data, DOM) {
    'use strict';
    var filesRepository = data.getFileRepository(),
        markdownParser = new Worker('scripts/markdownParser.js'),
        currentlyOpenedFileName;

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
        var fileNames = filesRepository.getFileNames();
        DOM.loadFilesInSidebar(fileNames, /* onClickFile */ openFile);
    }

    function addFile() {
        var newFile = filesRepository.createNewFile();
        DOM.loadFilesInSidebar(newFile.name, /* onClickFile */ openFile);
    }

    function openFile() {
        var fileName = this.text;
        currentlyOpenedFileName = fileName;
        DOM.setFileListItemAsActive(this);
        this.className = 'list-group-item active';
        console.log('opening file: ' + fileName);
        var file = filesRepository.getFile(fileName);
        loadContent(file.content);
        loadPreview(file.content);
    }

    function loadContent(fileContent) {
        console.log('Open editor with content: ' + fileContent);
        var editor = DOM.getOrCreateEditor(/* onEditorUpdated */ updateFileAndcomputePreview);
        editor.value = fileContent;
    }

    function loadPreview(fileContent) {
        DOM.getOrCreatePreview();
        computePreview(fileContent);
    }

    function updateFileAndcomputePreview(fileContent) {
        filesRepository.updateFile(currentlyOpenedFileName, fileContent);
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

}(window.iwrite = window.iwrite || {}, window.iwrite.data, window.iwrite.DOM)); /* injecting dependencies old school */

