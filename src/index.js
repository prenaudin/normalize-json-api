import humps from 'humps';
const { camelizeKeys, decamelizeKeys } = humps;

import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import keys from 'lodash/keys';
import clone from 'lodash/clone';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import pick from 'lodash/pick';
import flow from "lodash/fp/flow";
import flattenFp from "lodash/fp/flatten";
import extendFp from "lodash/fp/extend";
import groupByFp from "lodash/fp/groupBy";
import mapValuesFp from "lodash/fp/mapValues";

const flattenObject = function flattenObject(object) {
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

  return flow(
    obj => pick(obj, 'id', 'type'),
    extendFp(object.attributes),
    extendFp(relationships)
  )(object);
};

function flattenObjects(objectsToFlatten) {
  let objects = clone(objectsToFlatten);
  if (!isArray(objects)) { objects = [objects]; }
  return map(objects, flattenObject);
};

function flattenResponse(response) {
  const flatten = [];
  flatten.push(flattenObjects(response.data));

  if (response.included) {
    flatten.push(flattenObjects(response.included));
  }

  const entities = flow(
    flattenFp,
    groupByFp((value) => value.type),
    mapValuesFp((value) =>
      reduce(value, (result, resultValue) => {
        const formatResult = result;
        formatResult[resultValue.id] = camelizeKeys(resultValue);
        return formatResult;
      }, {})
    ))(flatten);

  const results = mapValues(entities, (value) =>
    map(keys(value), (key) => parseInt(key) || key)
  );
  return { results, entities };
};

export function normalize(obj) {
  if (!isObject(obj)) {
    throw new Error('Normalize accepts an object or an array as its input.');
  }
  return flattenResponse(obj);
}
