(function (iwrite) {
    'use strict';
    function LocalStorage(prefix) {
        this.prefix = prefix;
    }

    /* 
    Wrapper over local storage that adds application
    prefix and automatically stringifys/parses objects
    */
    LocalStorage.prototype.setItem = function (itemKey, itemValue) {
        itemKey = this.prefix + itemKey;
        if (typeof itemValue === 'object') {
            itemValue = JSON.stringify(itemValue);
        }
        window.localStorage.setItem(itemKey, itemValue);
    };

    LocalStorage.prototype.getItem = function (itemKey) {
        itemKey = this.prefix + itemKey;
        var itemValue = window.localStorage.getItem(itemKey);
        try {
            var parsedItemValue = JSON.parse(itemValue);
            return parsedItemValue;
        } catch (e) {
            return itemValue;
        }
    };

    iwrite.localStorage = new LocalStorage('iwrite.');
}(window.iwrite = window.iwrite || {}));
