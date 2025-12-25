import selectedButton from "../assets/Done_round.svg";

const StatusButton = ({
  id,
  imgURL,
  title,
  bgColor,
  selectedId,
  setSelectedId,
}) => {
  const onChangeHandler = (e) => {
    if (e.target.checked) {
      setSelectedId(e.target.id);
    }
  };

  return (
    <div className="mt-1">
      <input
        type="radio"
        name={`btn`}
        id={`btn-${id}`}
        className="h-0 w-0 hidden peer"
        onChange={onChangeHandler}
        checked={selectedId === `btn-${id}}`}
      />
      <label
        htmlFor={`btn-${id}`}
        className={`rounded-xl border-2 flex items-center pl-0.5 py-0.5 pr-4 ${
          selectedId === "btn-" + id ? "border-blue" : "border-lightGray"
        }`}
      >
        <div className="flex items-center gap-3">
          <img
            src={imgURL}
            alt={title}
            className={`${bgColor} p-2.5 rounded-lg`}
          />
          <p className={"text-black text-sm"}>{title}</p>
        </div>
        {selectedId === `btn-${id}` && (
          <img
            src={selectedButton}
            alt="selected icon"
            className={`bg-blue p-0.5 rounded-full size-5 ml-auto`}
          />
        )}
      </label>
    </div>
  );
};

export default StatusButton;
