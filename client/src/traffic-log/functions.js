export const getFullDateTimeString = function (str) {
  if (str) {
    const dateTimeMask = "0000-00-00T00:00:00.000Z";
    return str + dateTimeMask.substring(str.length);
  }

  return null;
};
