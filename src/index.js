import humps from 'humps';
const { camelizeKeys } = humps;

import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import keys from 'lodash/keys';
import clone from 'lodash/clone';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import pick from 'lodash/pick';
import extend from 'lodash/extend';
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';

function flattenObject(object) {
  const relationships = reduce(object.relationships, (result, value, key) => {
    const formatResult = result;
    if (isArray(value.data)) {
      formatResult[key] = map(value.data, (item) => item.id);
    } else {
      if (value.data) {
        formatResult[key] = value.data.id;
      }
    }
    return formatResult;
  }, {});

  return extend({},
    pick(object, 'id', 'type'),
    object.attributes,
    relationships
  );
}

function flattenObjects(objectsToFlatten) {
  let objects = clone(objectsToFlatten);
  if (!isArray(objects)) { objects = [objects]; }
  return map(objects, flattenObject);
}

function flattenResponse(response) {
  const flattenedObjects = [];
  flattenedObjects.push(flattenObjects(response.data));

  if (response.included) {
    flattenedObjects.push(flattenObjects(response.included));
  }

  let entities = flatten(flattenedObjects);
  entities = groupBy(entities, (value) => value.type);
  entities = mapValues(entities, (value) =>
    reduce(value, (result, resultValue) => {
      const formatResult = result;
      formatResult[resultValue.id] = camelizeKeys(resultValue);
      return formatResult;
    }, {})
  );

  const results = mapValues(entities, (value) =>
    map(keys(value), (key) => parseInt(key, 10) || key)
  );
  return { results, entities };
}

export function normalize(obj) {
  if (!isObject(obj)) {
    throw new Error('Normalize accepts an object or an array as its input.');
  }
  return flattenResponse(obj);
}
