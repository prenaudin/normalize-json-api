function camelizeString(str) {
  return str.replace(/-(.)/g, (match, group) => group.toUpperCase());
}

export default function camelizeKeys(object) {
  const camelizeObject = {};
  Object.keys(object).forEach((key) => (
    camelizeObject[camelizeString(key)] = object[key]
  ));
  return camelizeObject;
}
