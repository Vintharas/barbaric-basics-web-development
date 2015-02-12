(function (iwrite) {
    'use strict';
    var DOM = {
            loadFilesInSidebar: loadFilesInSidebar,
            setFileListItemAsActive: setFileListItemAsActive,
            getOrCreateEditor: getOrCreateEditor,
            getOrCreatePreview: getOrCreatePreview,
            setPreviewContent: setPreviewContent
        };

    iwrite.DOM = DOM;
    
    function loadFilesInSidebar(/* fileNames, onClickFile */) {
        var sidebarList = document.querySelector('.sidebar div.list-group'),
            filesToLoad,
            onClickFile;

        if (arguments.length === 2) {
            if (typeof arguments[0] === 'object') {
                filesToLoad = arguments[0];
            } else if (typeof arguments[0] === 'string') {
                filesToLoad = [arguments[0]];
            } else {
                throw new Error('Wrong typed arguments. First argument should be a fileName or an array of fileNames');
            }
            onClickFile = arguments[1];
        } 

        filesToLoad.forEach(loadFileInSidebar);
        setFirstItemAsActive();

        function loadFileInSidebar(fileName) {
            var a = document.createElement('a');
            a.innerHTML = fileName;
            a.className = 'list-group-item';
            a.href = '#';
            a.onclick = onClickFile;
            sidebarList.appendChild(a);
        }

        function setFirstItemAsActive() {
            var children = sidebarList.childNodes;
            if (children.length > 0) {
                onClickFile.call(children[0]);
            }
        }
    }

    function setFileListItemAsActive(element) {
        var sidebarList = document.querySelector('.sidebar div.list-group');
        var children = sidebarList.childNodes;
        children = Array.prototype.slice.call(children);
        children.forEach(function (child) {
            if (element === child) {
                child.className = 'list-group-item active';
            }
            child.className = 'list-group-item';
        });
    }

    function getOrCreateEditor(onEditorContentUpdated) {
        var div,
            textArea,
            content;

        textArea = document.querySelector('div.editor textarea');
        if (textArea) {
            return textArea;
        }

        div = document.createElement('div');
        div.className = 'col-md-6 col-sm-6 editor';
        textArea = document.createElement('textarea');
        textArea.className = 'form-control noresize';
        textArea.noResize = true;
        textArea.rows = 10;
        textArea.addEventListener('keypress', createOnEditorContentUpdated(onEditorContentUpdated));
        textArea.placeholder = 'Start writing something here in markdown...';
        div.appendChild(textArea);
        content = document.querySelector('div.content');
        content.appendChild(div);
        return textArea;
    }

    function createOnEditorContentUpdated(onEditorContentUpdated) {
        return function reloadPreview() {
            var editor = document.querySelector('div.editor textarea');
            onEditorContentUpdated(editor.value);
        }
    }

    function getOrCreatePreview() {
        var div,
            content;

        div = document.querySelector('div.preview');
        if (div) {
            return div;
        }

        div = document.createElement('div');
        div.className = 'col-md-6 col-sm-6 preview basic-borders';
        content = document.querySelector('div.content');
        content.appendChild(div);
        return div;
    }

    function setPreviewContent(parsedHtml) {
        var div = document.querySelector('div.preview');
        div.innerHTML = parsedHtml;
    }

}(window.iwrite = window.iwrite || {}));
