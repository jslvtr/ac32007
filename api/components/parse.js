
function toArrayFormat(array) {
    var headerArray = [];
    if (array != null)  {
        Object.keys(array).forEach(function (key) {
            headerArray.push({
                key : key,
                value : array[key]
            });
        });
    }


    return headerArray;
}

function toDatabaseFormat(array)    {
    var database_format = {};
    if (array != null) {
        for (var i=0;i<array.length;i++) {
            var keyVal = array[i];
            database_format[keyVal.key] = keyVal.value;
        }
    }

    return database_format;
}

module.exports = {
    toArrayFormat       :   toArrayFormat,
    toDatabaseFormat    :   toDatabaseFormat
};


