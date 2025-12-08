const IconChip = ({ id, labelContent }) => {
  return (
    <div className="flex mt-1">
      <input
        type="radio"
        name={`chip`}
        id={`chip-${id}`}
        className="h-0 w-0 hidden peer"
      />
      <label
        htmlFor={`chip-${id}`}
        className="rounded-xl bg-veryLightGray p-3 peer-checked:bg-yellow"
      >
        {labelContent}
      </label>
    </div>
  );
};

export default IconChip;
