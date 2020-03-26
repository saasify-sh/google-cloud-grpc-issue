'use strict'

const isArrayValue = (obj) => obj.hasOwnProperty('arrayValue')
const isMapValue = (obj) => obj.hasOwnProperty('mapValue')

/**
 * Converts Firestore doc into JS values without value types.
 */
exports.getSnapshotData = (input) => {
  return Array.isArray(input)
    ? input.map((obj) => extractObject(obj))
    : extractObject(input)
}

const extractObject = (value) => {
  const output = {}

  if (value) {
    Object.keys(value).forEach((k) => {
      const valueField = value[k]
      output[k] = extractValueField(valueField)
    })
  }

  return output
}

const extractValueField = (valueField) => {
  if (isArrayValue(valueField)) {
    return (valueField.arrayValue.values || []).map((v) => extractValueField(v))
  }

  if (isMapValue(valueField)) {
    return extractObject(valueField.mapValue.fields)
  }

  if (!(valueField instanceof Object)) {
    return valueField
  }

  const key = Object.keys(valueField)[0]
  return valueField[key]
}
