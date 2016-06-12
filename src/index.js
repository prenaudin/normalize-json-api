import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import reduce from 'lodash/reduce';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';

import camelizeKeys from './camelizeKeys';

function normalizeEntity(entity) {
  const normalized = {
    id: entity.id,
    type: entity.type,
  };

  Object.keys(entity.attributes || []).forEach((key) => {
    normalized[key] = entity.attributes[key];
  });

  Object.keys(entity.relationships || []).forEach((key) => {
    const value = entity.relationships[key];
    if (isArray(value.data)) {
      normalized[key] = value.data.map((item) => item.id);
    } else if (isObject(value.data)) {
      normalized[key] = value.data.id;
    }
  });

  return normalized;
}

function normalizeResponse({ data, included }) {
  let entities = []
    .concat((isArray(data) ? data : [data]).map(normalizeEntity))
    .concat((included || []).map(normalizeEntity));

  entities = groupBy(entities, (value) => value.type);
  entities = mapValues(entities, (value) =>
    reduce(value, (result, resultValue) => {
      const formatResult = result;
      formatResult[resultValue.id] = camelizeKeys(resultValue);
      return formatResult;
    }, {})
  );

  const results = mapValues(entities, (value) =>
    Object.keys(value).map((key) => parseInt(key, 10) || key)
  );
  return { results, entities };
}

export function normalize(obj) {
  if (!isObject(obj)) {
    throw new Error('Normalize JSON API accepts an object as its input.');
  }
  return normalizeResponse(obj);
}
