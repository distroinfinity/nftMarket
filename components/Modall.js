import Dialog from "./Dialog";

export default function Modal(props) {
  const { open, onClose, title, children, onConfirm } = props;
  if (!open) {
    return <></>;
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <h2 className="text-xl">{title}</h2>
      <div className="py-5">{children}</div>
      <div className="flex justify-end">
        <div className="p-1">
          <Button
            onClick={() => onClose()}
            className="bg-secondary hover:bg-secondary-light"
          >
            No
          </Button>
        </div>
        <div className="p-1">
          <Button
            onClick={() => {
              onClose();
              onConfirm();
            }}
          >
            Yes
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

function Button(props) {
  const { type = "button", children, onClick, className = "" } = props;
  return (
    <button
      className={`bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
