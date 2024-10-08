import { Sails } from "sails-js";
import {
  ISailsEnumDef,
  ISailsFixedSizeArrayDef,
  ISailsMapDef,
  ISailsPrimitiveDef,
  ISailsResultDef,
  ISailsStructDef,
  ISailsTypeDef,
  ISailsUserDefinedDef,
  ISailsVecDef,
} from "sails-js-types";

import { RESULT } from "../../consts";
import { ISailsFuncArg, PayloadValue } from "../../types";

function getPreformattedText(obj) {
  return JSON.stringify(obj, null, 2);
}

const getDefaultValue = (sails: Sails) => {
  const getPrimitiveValue = (
    def: ISailsPrimitiveDef,
  ) => (def.isBool ? false : "");
  const getResultValue = ({ [RESULT.OK]: { def } }: ISailsResultDef) => ({
    [RESULT.OK]: getValue(def),
  });
  const getVecValue = ({ def }: ISailsVecDef) =>
    getPreformattedText([getValue(def)]);
  const getFixedSizeArrayValue = ({ len, def }: ISailsFixedSizeArrayDef) =>
    new Array<PayloadValue>(len).fill(getValue(def));
  const getMapValue = ({ key, value }: ISailsMapDef) =>
    getPreformattedText([[getValue(key.def), getValue(value.def)]]);
  const getUserDefinedValue = ({ name }: ISailsUserDefinedDef) =>
    getValue(sails.getTypeDef(name));
  const getEnumValue = ({ variants: [{ def, name }] }: ISailsEnumDef) => ({
    [name]: def ? getValue(def) : null,
  });

  const getStructValue = ({ isTuple, fields }: ISailsStructDef) => {
    if (isTuple) return fields.map(({ def }) => getValue(def));

    const result = fields.map(({ name, def }, index) =>
      [name || index, getValue(def)] as const
    );

    return Object.fromEntries(result);
  };

  const getValue = (def: ISailsTypeDef): PayloadValue => {
    if (def.isPrimitive) return getPrimitiveValue(def.asPrimitive);
    if (def.isOptional) return null;
    if (def.isResult) return getResultValue(def.asResult);
    if (def.isVec) return getVecValue(def.asVec);
    if (def.isFixedSizeArray) {
      return getFixedSizeArrayValue(def.asFixedSizeArray);
    }
    if (def.isMap) return getMapValue(def.asMap);
    if (def.isUserDefined) return getUserDefinedValue(def.asUserDefined);
    if (def.isStruct) return getStructValue(def.asStruct);
    if (def.isEnum) return getEnumValue(def.asEnum);

    throw new Error("Unknown type: " + JSON.stringify(def));
  };

  return getValue;
};

const getDefaultPayloadValue = (sails: Sails, args: ISailsFuncArg[]) => {
  const result = args.map(({ typeDef }, index) =>
    [index, getDefaultValue(sails)(typeDef)] as const
  );

  return Object.fromEntries(result);
};

export { getDefaultPayloadValue, getDefaultValue };
