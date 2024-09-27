import { Button } from "@gear-js/ui";

type Props = {
  disabled?: boolean;
  onCloseClick: () => void;
};

function FormButtons({ disabled, onCloseClick }: Props) {
  return (
    <div className={""}>
      <Button type="submit" text="Submit" size="large" disabled={disabled} />
      <Button text="Cancel" size="large" color="light" onClick={onCloseClick} />
    </div>
  );
}

export { FormButtons };
