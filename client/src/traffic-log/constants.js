import _ from "lodash";

export const days = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

export const hours = _.range(0, 24);

export const types = [
  "Live Read Promo",
  "Recorded Promo",
  "Live Read PSA",
  "Recorded PSA",
  "Underwriting Spot",
  "Pledge Liner",
  "Station ID",
  "Other",
];
