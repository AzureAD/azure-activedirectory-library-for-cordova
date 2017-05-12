function LogItem(item) {
    this.message = item.message;
    this.level = item.level;
    this.additionalMessage = item.additionalMessage;
    this.tag = item.tag;
    this.errorCode = item.errorCode;
}

module.exports = LogItem;