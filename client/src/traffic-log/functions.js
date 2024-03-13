export const getFullDateTimeString = function (str) {
  if (str) {
    const dateTimeMask = "0000-00-00T00:00:00.000Z";
    return str + dateTimeMask.substring(str.length);
  }

  return null;
};

export const copyStarted = function (start_on) {
  if (start_on) {
    const start = new Date(start_on.slice(0, 19));
    return start < Date.now();
  }

  return false;
};

export const copyExpired = function (expire_on) {
  if (expire_on) {
    const expire = new Date(expire_on.slice(0, 19));
    return expire < Date.now();
  }
};
