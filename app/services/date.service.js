function convertDateToHTMLValue(date) {
  const dateTokens = date
    .toLocaleDateString("en-US", { timeZone: "America/Chicago" })
    .split("/");
  const year = dateTokens[2];
  const month = dateTokens[0].padStart(2, "0");
  const day = dateTokens[1].padStart(2, "0");

  return `${year}-${month}-${day}`;
}

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
  convertDateToHTMLValue,
  getEndDateFromHTMLValue,
  getStartDateFromHTMLValue,
  getXDaysPrevious,
};
