function getEndDateFromHTMLValue(end) {
  return new Date(`${end}T23:59:00.000-05:00`);
}

function getStartDateFromHTMLValue(start) {
  return new Date(`${start}T00:00:00.000-05:00`);
}

function getXDaysPrevious(x) {
  const date = new Date();
  date.setDate(date.getDate() - x);
  return date;
}

module.exports = {
  getEndDateFromHTMLValue,
  getStartDateFromHTMLValue,
  getXDaysPrevious,
};
