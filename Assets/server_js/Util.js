const MessageType = require("./MessageType");
const MessageFlags = require("./MessageFlags");


const _MessageTypeToString = {};
for (let name in MessageType) {
    _MessageTypeToString[MessageType[name]] = name.toString();
}



/**
 * @return {string}
 */
exports.MessageFlagsToString = function (flags) {
    let res = "";
    for (let flag in MessageFlags){
        if ((MessageFlags[flag] & flags) !== 0)
            res += flag + ","
    }
    return res;
};

/**
 * @return {string}
 */
exports.MessageTypeToString = function (messageType) {
    if (messageType in _MessageTypeToString) {
        return _MessageTypeToString[messageType];
    }
    return "unknown" + messageType;
};

exports.json_safe_parse = function  (json) {
    let parsed;
    try {
        parsed = JSON.parse(json)
    } catch (e) {
        return null;
    }
    return parsed;
};

exports.json_safe_parse_buffer = function (buffer) {
    let parsed;
    try {
        parsed = JSON.parse(buffer.toString('utf-8'));
    } catch (e) {
        return null;
    }
    return parsed;
};

const EmptyMessage = Buffer.allocUnsafe(1);
EmptyMessage.writeUInt8(255);

exports.EmptyMessage = EmptyMessage;

