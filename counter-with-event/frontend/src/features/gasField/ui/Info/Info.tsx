import { CSSTransition } from "react-transition-group";

enum AnimationTimeout {
  Tiny = 50,
  Small = 150,
  Default = 250,
  Medium = 400,
  Big = 1000,
}

type Props = {
  isAwait: boolean;
  reserved: string;
  returned: string;
};

const Info = ({ isAwait, reserved, returned }: Props) => (
  <CSSTransition in appear timeout={AnimationTimeout.Default}>
    <div className={""}>
      {isAwait && (
        <p className={""}>
          <span className={""}>Added to waitlist...</span>
        </p>
      )}
      <p className={""}>
        <span className={""}>Reserved:</span>
        <span className={""}>{reserved}</span>
      </p>
      <p className={""}>
        <span className={""}>Maybe returned:</span>
        <span className={""}>{returned}</span>
      </p>
    </div>
  </CSSTransition>
);

export { Info };
