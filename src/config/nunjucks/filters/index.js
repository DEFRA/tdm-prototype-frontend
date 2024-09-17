// import { assign, isArray, isNil, compact, union } from 'lodash'
import { assign, compact } from 'lodash-es'

// import { compact } from '~/node_modules/cdp-portal-frontend/src/config/nunjucks/filters/index.js'

import { formatDate } from '~/src/config/nunjucks/filters/format-date.js'
import { formatCurrency } from '~/src/config/nunjucks/filters/format-currency.js'

// Borrowed from lodash as import isn't working
// function compact(array) {
//   var index = -1,
//     length = array == null ? 0 : array.length,
//     resIndex = 0,
//     result = [];
//
//   while (++index < length) {
//     var value = array[index];
//     if (value) {
//       result[resIndex++] = value;
//     }
//   }
//   return result;
// }

export {
  assign,
  formatDate,
  formatCurrency,
  // relativeDate,
  // isArray,
  // sanitiseUser,
  // isNil,
  compact
  // union
}
