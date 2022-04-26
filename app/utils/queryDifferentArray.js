'use strict';

function queryDifferentArray(arr1, arr2) {
  return arr1.filter(items => {
    return !arr2.some(item => {
      return items.specification_id === item.specification_id;
    });
  });
}

module.exports = {
  queryDifferentArray,
};
