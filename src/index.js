import camelize from 'camelize';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';

function flattenObject(object) {
  const normalized = {
    id: object.id,
    type: object.type,
  };

  forEach(object.attributes, (value, key) => {
    normalized[key] = value;
  });

  forEach(object.relationships, (value, key) => {
    if (isArray(value.data)) {
      normalized[key] = map(value.data, (item) => item.id);
    } else if (isObject(value.data)) {
      normalized[key] = value.data.id;
    }
  });

  return normalized;
}

function flattenObjects(objects) {
  return map(isArray(objects) ? objects : [objects], flattenObject);
}

function flattenResponse({ data, included }) {
  let entities = []
    .concat(flattenObjects(data))
    .concat(flattenObjects(included || []));

  entities = groupBy(entities, (value) => value.type);
  entities = mapValues(entities, (value) =>
    reduce(value, (result, resultValue) => {
      const formatResult = result;
      formatResult[resultValue.id] = camelize(resultValue);
      return formatResult;
    }, {})
  );

  const results = mapValues(entities, (value) =>
    map(Object.keys(value), (key) => parseInt(key, 10) || key)
  );
  return { results, entities };
}

export function normalize(obj) {
  if (!isObject(obj)) {
    throw new Error('Normalize accepts an object or an array as its input.');
  }
  return flattenResponse(obj);
}
