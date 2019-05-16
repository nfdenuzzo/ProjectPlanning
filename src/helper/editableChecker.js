import DateUtil from '../helper/dateUtil'

export default {
  checkIfNotEditable (date) {
    let dateFormated = DateUtil.helperDateParser(date)
    return DateUtil.helperIsBefore(dateFormated, DateUtil.helperStartOfToday())
  }
}
