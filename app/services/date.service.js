const { DateTime } = require("luxon");
const DEFAULT_FORMAT = "luxon";
const HTML_DATE_INPUT_FORMAT = "yyyy-MM-DD";
const CHICAGO_TIME_ZONE = "America/Chicago";

function currentChicagoDateTime(format) {
  const dt = DateTime.now().setZone("America/Chicago");
  switch (format) {
    case "luxon":
      return dt;
    case "ISO":
      return dt.toISO();
    default:
      return dt.toJSDate();
  }
}

function currentChicagoWeekday() {
  const dt = currentChicagoDateTime(DEFAULT_FORMAT);
  return dt.weekday;
}

function currentChicagoHour() {
  const dt = currentChicagoDateTime(DEFAULT_FORMAT);
  return dt.hour;
}

function getEndDateFromHTMLValue(end) {
  return new Date(`${end}T23:59:00.000-05:00`);
}

function getStartDateFromHTMLValue(start) {
  return new Date(`${start}T00:00:00.000-05:00`);
}

function startOfChicagoDayFromHTMLValue(value) {
  const dt = DateTime.fromISO(value, {
    zone: CHICAGO_TIME_ZONE,
  }).startOf("day");

  if (dt.invalid) {
    throw new Error(dt.invalidExplanation);
  }

  return dt.toISO();
}

function fullChicagoISOFromISODate(value, adjustTo) {
  const dt = DateTime.fromISO(value, {
    zone: CHICAGO_TIME_ZONE,
  });

  if (dt.invalid) {
    throw new Error(dt.invalidExplanation);
  }

  let iso;
  switch (adjustTo) {
    case "start":
      iso = dt.startOf("day").toISO();
      break;
    case "end":
      iso = dt.endOf("day").toISO();
      break;
    default:
      iso = dt.toISO();
  }

  return iso;
}

function getXDaysPrevious(x) {
  const date = new Date();
  date.setDate(date.getDate() - x);
  return date;
}

module.exports = {
  currentChicagoDateTime,
  currentChicagoWeekday,
  currentChicagoHour,
  getEndDateFromHTMLValue,
  getStartDateFromHTMLValue,
  getXDaysPrevious,
  startOfChicagoDayFromHTMLValue,
  fullChicagoISOFromISODate,
};
