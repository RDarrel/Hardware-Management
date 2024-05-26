import React from "react";
import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";

export default function CustomSelect({
  choices = [],
  preValue = "",
  onChange = () => {},
  getObject = false,
  label,
  values = "",
  texts = "",
  className = "",
  disableAll = false,
  multiple = false,
  disabledAllExceptSelected = false,
  disableByKey = {}, // { key: ['disabled', 'values'] }
  allowSearch = true,
}) {
  const handleDisabling = (value, obj) => {
    if (disableAll) return true;
    if (disabledAllExceptSelected && value !== preValue) return true;

    if (!!Object.keys(disableByKey).length) {
      for (const key in disableByKey) {
        if (disableByKey[key].includes(obj[key])) return true;
      }
    }

    return false;
  };
  return (
    <MDBSelect
      label={label}
      getValue={(array) => {
        if (multiple)
          return onChange(
            getObject ? choices.filter((c) => array.includes(c[values])) : array
          );

        onChange(
          getObject
            ? choices.find((choice) => choice[values] === array[0])
            : array[0]
        );
      }}
      className={className}
      multiple={multiple}
      color="primary"
    >
      <MDBSelectInput selected={preValue} />
      <MDBSelectOptions search={allowSearch ? choices.length >= 10 : false}>
        {choices.map((choice, index) => {
          const value = values ? choice[values] : choice,
            text = texts ? choice[texts] : choice;

          return (
            <MDBSelectOption
              id={`${label}-${value}`}
              disabled={handleDisabling(value, choice)}
              checked={preValue ? value === preValue : false}
              key={`${label}-${index}`}
              value={value}
            >
              {text}
            </MDBSelectOption>
          );
        })}
      </MDBSelectOptions>
    </MDBSelect>
  );
}
