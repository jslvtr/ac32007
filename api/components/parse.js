
function toArrayFormat(array) {
    var headerArray = [];
    if (array != null)  {
        Object.keys(array).forEach(function (key) {
            console.log(key, array[key])
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
        array.forEach(function (keyVal) {
            database_format[keyVal.key] = keyVal.value;
        });
    }

    return database_format;
}

module.exports = {
    toArrayFormat       :   toArrayFormat,
    toDatabaseFormat    :   toDatabaseFormat
};


