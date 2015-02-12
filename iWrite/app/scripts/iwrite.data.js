(function (iwrite, localStorage) {
    'use strict';


    iwrite.data = {
        getFileRepository: getFileRepository
    }

    function getFileRepository() {
        return new FilesRepository();
    }

    function FilesRepository() {
        var fileNames,
            files = {},
            KEY_FILENAMES = 'fileNames',
            savingInterval = setSavingInterval();

        return {
            getFileNames: getFileNames,
            createNewFile: createNewFile,
            getFile: getFile,
            updateFile: updateFile
        }
        
        function getFileNames() {
            if (!fileNames) {
                fileNames = iwrite.localStorage.getItem(KEY_FILENAMES) || [];
            }
            return fileNames;
        }

        function createNewFile() {
            var newFileName = getNewFileName();
            fileNames.push(newFileName); // TODO: sort alphabetically

            var newFile = { name: newFileName, content: 'Start writing here in markdown...' };
            localStorage.setItem(KEY_FILENAMES, fileNames);
            localStorage.setItem(newFileName, newFile);

            files[newFileName] = newFile;

            return newFile;
        }

        function getNewFileName() {
            var newFileNameTemplate = 'New File ',
                newFileName = 'New File 1',
                counter = 1;
            while (filenameAlreadyExists(newFileName)) {
                counter++;
                newFileName = newFileNameTemplate + counter.toString();
            }
            return newFileName;

            function filenameAlreadyExists(newFileName) {
                return fileNames.some(function(fileName) { return newFileName === fileName; });
            }
        }

        function getFile(fileName) {
            if (!files[fileName])
                files[fileName] = iwrite.localStorage.getItem(fileName);
            return files[fileName];
        }

        function updateFile(fileName, fileContent) {
            files[fileName] = {name: fileName, content: fileContent};
        }

        function setSavingInterval() {
            window.setInterval(saveFiles, 2000);
        }

        function saveFiles() {
            // TODO: optimized to save only files that have changed
            for (var file in files) {
                iwrite.localStorage.setItem(file.name, file.content);
            }
        }
    }

}(window.iwrite = window.iwrite || {}, iwrite.localStorage));
