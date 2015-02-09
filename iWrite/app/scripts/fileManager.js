(function (iwrite) {
    'use strict';
    var addImageBtn,
        addFileBtn,
        fileNames,
        KEY_FILENAMES = 'fileNames',
        DOM = {
            loadFilesInSidebar: loadFilesInSidebar
        },
        markdownParser = new Worker('scripts/markdownParser.js');

    markdownParser.onmessage = handleParsedHtml;

    window.addEventListener('load', initialize);
    
    function initialize() {
        addImageBtn = document.getElementById('add-image');
        addImageBtn.addEventListener('click', addImage);
        addFileBtn = document.getElementById('add-file');
        addFileBtn.addEventListener('click', addFile);

        loadExistingFiles();
    }

    function addImage() {
       // add image and paint with canvas and svg or something like that 
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

        DOM.loadFilesInSidebar(newFileName);
        // TODO: load writing area

        function filenameAlreadyExists(newFileName) {
            return fileNames.some(function(fileName) { return newFileName === fileName; });
        }
    }

    function loadExistingFiles() {
        fileNames = iwrite.localStorage.getItem(KEY_FILENAMES) || [];
        DOM.loadFilesInSidebar();
    }
    
    function loadFilesInSidebar() {
        var sidebarList = document.querySelector('.sidebar div.list-group'),
            filesToLoad;

        if (arguments.length === 0) {
            filesToLoad = fileNames;
        } else {
            filesToLoad = Array.prototype.slice.call(arguments);
        }

        filesToLoad.forEach(loadFileInSidebar);
        setFirstItemAsActive();

        function loadFileInSidebar(fileName) {
            var a = document.createElement('a');
            a.innerHTML = fileName;
            a.className = 'list-group-item';
            a.href = '#';
            a.onclick = openFile;
            sidebarList.appendChild(a);
        }

        function setFirstItemAsActive() {
            var children = sidebarList.childNodes;
            if (children.length > 0) {
                openFile.call(children[0]);
            }
        }
    }
    
    function openFile() {
        var fileName = this.text;
        setItemAsActive(this);
        this.className = 'list-group-item active';
        console.log('opening file: ' + fileName);
        var file = iwrite.localStorage.getItem(fileName);
        loadContent(file.content);
        loadPreview(file.content);
    }

    function setItemAsActive(item) {
        var sidebarList = document.querySelector('.sidebar div.list-group');
        var children = sidebarList.childNodes;
        children = Array.prototype.slice.call(children);
        children.forEach(function (child) {
            if (item === child)
                child.className = 'list-group-item active';
            child.className = 'list-group-item';
        });
    }

    function loadContent(fileContent) {
        console.log('Open editor with content: ' + fileContent);
        var editor = getOrCreateEditor();
        editor.value = fileContent;
    }

    function getOrCreateEditor() {
        var div,
            textArea,
            content;

        textArea = document.querySelector('div.editor textarea');
        if (textArea)
            return textArea;

        div = document.createElement('div');
        div.className = 'col-md-6 col-sm-6 editor';
        textArea = document.createElement('textarea');
        textArea.className = 'form-control noresize';
        textArea.noResize = true;
        textArea.rows = 10;
        textArea.addEventListener('keypress', reloadPreview);
        div.appendChild(textArea);
        content = document.querySelector('div.content');
        content.appendChild(div);
        return textArea;
    }

    function loadPreview(fileContent) {
        getOrCreatePreview();
        computePreview(fileContent);
    }

    function reloadPreview() {
        var editor = document.querySelector('div.editor textarea');
        computePreview(editor.value);
    }

    function getOrCreatePreview() {
        var div,
            content;

        div = document.querySelector('div.preview');
        if (div)
            return div;

        div = document.createElement('div');
        div.className = 'col-md-6 col-sm-6 preview basic-borders';
        content = document.querySelector('div.content');
        content.appendChild(div);
        return div;
    }

    function computePreview(fileContent) {
        console.log('sending data to worker: ', fileContent);
        markdownParser.postMessage(fileContent);
    }

    function handleParsedHtml(e) {
        var parsedHtml = e.data;
        console.log('received data from worker: ', parsedHtml);

        var div = document.querySelector('div.preview');
        div.innerHTML = parsedHtml;
    }

}(window.iwrite = window.iwrite || {}));

