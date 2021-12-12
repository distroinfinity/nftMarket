import ExitIcon from "./Exit";
import IconButton from "./Icon";

export default function Dialog(props) {
  const { open, onClose } = props;
  if (!open) {
    return <></>;
  }
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
        <div>{props.children}</div>
        <span className="absolute top-0 right-0 p-4">
          {" "}
          <IconButton onClick={() => onClose()}>
            <ExitIcon />
          </IconButton>
        </span>
      </div>
    </div>
  );
}
