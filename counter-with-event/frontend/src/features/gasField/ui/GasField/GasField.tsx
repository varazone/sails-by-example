import { Button, InputProps, inputStyles, InputWrapper } from "@gear-js/ui";
import BigNumber from "bignumber.js";
import { useFormContext, useWatch } from "react-hook-form";
import { NumericFormat, NumericFormatProps } from "react-number-format";

import { Result } from "@/hooks/useGasCalculate/types";
import { BalanceUnit } from "@/shared/ui/form/balance-unit";

import { Info } from "../Info";

type Props =
  & Omit<
    NumericFormatProps & InputProps,
    "value" | "onValueChange" | "onChange"
  >
  & {
    info: Result | undefined;
    onGasCalculate: () => void;
  };

const GasField = (props: Props) => {
  const {
    disabled,
    onGasCalculate,
    direction = "x",
    gap,
    block,
    info,
    ...other
  } = props;
  const name = "gasLimit";

  const { setValue, getFieldState, formState } = useFormContext();
  const inputValue = useWatch({ name });
  const { error } = getFieldState(name, formState);

  const increaseByTenPercent = () => {
    const bnValue = BigNumber(inputValue);

    const bnMultiplier = bnValue.multipliedBy(0.1);
    const increasedValue = bnValue.plus(bnMultiplier);

    setValue(name, increasedValue.toFixed(), { shouldValidate: true });
  };

  return (
    <InputWrapper
      id={name}
      label="Gas limit"
      size="normal"
      error={error?.message}
      direction={direction}
      gap={gap}
      className={""}
    >
      <div className={""}>
        <div className={""}>
          <div className={""}>
            <div className={""}>
              <NumericFormat
                {...other}
                id={name}
                name={name}
                className={""}
                allowNegative={false}
                thousandSeparator
                value={inputValue}
                onValueChange={({ value }) =>
                  setValue(name, value, { shouldValidate: true })}
              />

              <BalanceUnit />
            </div>

            <Button
              text="+ 10%"
              color="light"
              className={""}
              onClick={increaseByTenPercent}
            />
          </div>

          <Button
            text="Calculate"
            color="light"
            disabled={disabled}
            onClick={onGasCalculate}
          />
        </div>

        {info && (
          <Info
            isAwait={info.waited}
            reserved={info.reserved}
            returned={info.mayBeReturned}
          />
        )}
      </div>
    </InputWrapper>
  );
};

export { GasField };
