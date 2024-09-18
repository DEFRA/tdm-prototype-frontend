import { formatDate } from '~/src/config/nunjucks/filters/format-date.js'
import { formatCurrency } from '~/src/config/nunjucks/filters/format-currency.js'

const assign = Object.assign

// const concat = function(/** @type {string | any[]} */ array, /** @type {any} */ values) {
//   return array.concat(values);
// }

const compact = function (/** @type {any[]} */ arr) {
  return arr.filter(Boolean)
}

export {
  assign,
  formatDate,
  formatCurrency,
  compact
  // union
}
