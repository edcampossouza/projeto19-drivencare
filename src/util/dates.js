import errors from "../errors/index.js";
const intToDate = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};
export function integerToDateString(day) {
  const dow = intToDate[day];
  if (!dow) throw errors.dateError(`invalid day of week number: ${day}`);
  return dow;
}

// returns a list of available times in the form [{start, end}]
// parameter {startHour, endHour}: beginning and end of the workday
// parameter busyHoursList: list of current appointments in the form {begins, ends}
export function sliceHours({ startHour, endHour }, busyHoursList) {
  const vacanciesArr = [];

  // if there are no appointments, then the whole day is free!
  if (busyHoursList.length === 0)
    return [
      {
        begins: startHour,
        ends: endHour,
      },
    ];

  // the first free interval begins:
  // right at the start of the day; or
  // after the first appointment, if the appointment begins at the start of the day
  const firstVacancy = {};
  const firstAppointment = busyHoursList[0];
  if (firstAppointment.begins === startHour) {
    firstVacancy.begins = firstAppointment.ends;
    busyHoursList.splice(0, 1);
  } else {
    firstVacancy.begins = startHour;
  }
  vacanciesArr.push(firstVacancy);

  // each free interval consists of the end of an appointment and the start of the next one
  for (let index = 0; index < busyHoursList.length; index++) {
    const { begins, ends } = busyHoursList[index];
    vacanciesArr[vacanciesArr.length - 1].ends = begins;
    vacanciesArr.push({ begins: ends });
  }
  vacanciesArr[vacanciesArr.length - 1].ends = endHour;

  // removes 0-length intervals (i.e. begins === ends)
  const result = vacanciesArr.filter((v) => v.begins < v.ends);

  return result;
}
