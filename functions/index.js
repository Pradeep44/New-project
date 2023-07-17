function getChangeInPercent(currentVal, previousVal) {
const change = (currentVal - previousVal)/previousVal * 100;
return change;
}

module.exports = { getChangeInPercent };