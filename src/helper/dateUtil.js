import Datefns from 'date-fns'

export default {
  // Returns date time in the following format: 2018-01-01 14:00:00
  helperStandardDateTimeFormat (dateToFormat) {
    return Datefns.format(dateToFormat, 'YYYY-MM-DD HH:mm:ss')
  },
  // Returns ONLY the DATE in the following format: 2018-01-01
  helperStandardDateOnlyFormat (dateToFormat) {
    return Datefns.format(dateToFormat, 'YYYY-MM-DD')
  },
  // Returns ONLY the TIME in the following format: 14:00:00
  helperStandardTimeOnlyFormat (dateToFormat) {
    return Datefns.format(dateToFormat, 'HH:mm:ss')
  },
  // Format the date
  helperPrettifyDate (dateToFormat) {
    return Datefns.format(dateToFormat, 'dddd, D MMMM YYYY')
  },
  // Format the date
  helperShortPrettifyDate (dateToFormat) {
    return Datefns.format(dateToFormat, 'dddd, D MMMM')
  },
  // Format the date
  helperGetWeekDayName (dateToFormat) {
    return Datefns.format(dateToFormat, 'dddd')
  },
  // Format the date
  helperGetWeekDaySortName (dateToFormat) {
    return Datefns.format(dateToFormat, 'ddd')
  },
  // Format the date
  helperGetDayNameWording (dateToFormat) {
    return Datefns.format(dateToFormat, 'Do')
  },
  // Converts a date in string format to a date as a Date object
  helperDateParser (dateString) {
    return Datefns.parse(dateString)
  },
  helperGetDifferenceInDays (datefrom, dateTo) {
    return Datefns.differenceInDays(datefrom, dateTo)
  },
  helperSetDate (date, newDay) {
    return Datefns.setDate(date, newDay)
  },
  helperSubtractMonths (date, amount) {
    return Datefns.subMonths(date, amount)
  },
  helperAddMonths (date, amount) {
    return Datefns.addMonths(date, amount)
  },
  helperSubtractDays (date, amount) {
    return Datefns.subDays(date, amount)
  },
  helperAddDays (date, amount) {
    return Datefns.addDays(date, amount)
  },
  // This method will return the current year
  helperGetCurrentYear () {
    return Datefns.getYear(new Date())
  },
  helperIsSameDay (firstDate, secondDate) {
    return Datefns.isSameDay(firstDate, secondDate)
  },
  helperGetDateMinutues (date) {
    return Datefns.getMinutes(date)
  },
  helperGetDateHours (date) {
    return Datefns.getHours(date)
  },
  // Expects string in the following format: HH:mm:ss
  helperParseTimeString (timeString) {
    const test = `2018-01-01T${timeString}`
    return Datefns.parse(test)
  },
  helperIsWithinRange (dateToCheck, startDate, endDate) {
    return Datefns.isWithinRange(this.helperStandardDateOnlyFormat(dateToCheck), this.helperStandardDateOnlyFormat(startDate), this.helperStandardDateOnlyFormat(endDate))
  },
  // get the current day in the form of a int
  helperGetWeekDay (date) {
    return Datefns.getDay(date)
  },
  helperEachDay (dateFrom, dateTo) {
    return Datefns.eachDay(dateFrom, dateTo)
  },
  helperGetDifferenceInMonhts (dateFrom, dateTo) {
    return Datefns.differenceInCalendarMonths(dateTo, dateFrom)
  },
  helperisAfter (checkDate, date) {
    return Datefns.isAfter(checkDate, date)
  },
  helperShortformat (dateToFormat) {
    return Datefns.format(dateToFormat, 'D MMM YY')
  },
  helperGetMin (date) {
    return Datefns.getMinutes(date)
  },
  helperSetWeekDay (weekDay, date) {
    return Datefns.setDay(date, weekDay)
  },
  helperAddWeeks (date, count) {
    return Datefns.addWeeks(date, count)
  },
  helperIsBefore (dateToValidate, beforeDate) {
    return Datefns.isBefore(dateToValidate, beforeDate)
  },
  helperStartOfToday () {
    return Datefns.startOfToday()
  }
}
