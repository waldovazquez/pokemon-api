const debug = require('debug')('utils:query');

exports.getQuery = (query, userId, sort) => {
  debug('getQuery called');
  let newQuery = null;
  let newSort = {
    by: null,
    value: null,
  };

  if (query) {
    newQuery = query.slice(0, query.length - 1).split(',');
  }

  const formatQuery = [];
  if (newQuery) {
    newQuery.forEach((item) => {
      const objectToPush = {
        [item.split(':')[0]]: {
          $regex: item.split(':')[1],
          $options: 'i',
        },
      };
      formatQuery.push(objectToPush);
    });
  }

  if (sort) {
    newSort = {
      by: sort.by,
      value: sort.value,
    };
  }

  const queryReturned = {
    $and: [
      {
        $or: [{ userId: { $exists: false } }, { userId }],
      },
      ...formatQuery,
    ],
  };

  return {
    query: queryReturned,
    sort: newSort,
  };
};
