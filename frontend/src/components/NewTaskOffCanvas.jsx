import close from "../assets/close_ring_duotone-1.svg";
import deleteIcon from "../assets/Trash.svg";
import saveIcon from "../assets/Done_round_duotone.svg";
import { useTaskSlice } from "../hooks/useTaskSlice.js";

const NewTaskOffCanvas = () => {
  const { closeOffCanvasHandler } = useTaskSlice();
  return (
    <div className="p-6 flex flex-col font-custom">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-medium text-2xl">Task Details</h3>
        <button
          type="button"
          className="border border-lightGray rounded-md p-2"
          onClick={closeOffCanvasHandler}
        >
          <img src={close} alt="Close" />
        </button>
      </div>
      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label htmlFor="taskName" className="text-gray text-sm">
            Task name
          </label>
          <input
            type="text"
            id="taskName"
            name="taskName"
            placeholder="Enter your task name"
            className="py-2 px-4 border border-gray rounded-md"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="taskDescription" className="text-gray text-sm">
            Description
          </label>
          <textarea
            name="taskDescription"
            id="taskDescription"
            cols="30"
            rows="10"
            placeholder="Enter a short description"
            className="py-2 px-4 border border-gray rounded-md"
          ></textarea>
        </div>
        <div>
          <label className="text-gray text-sm">Icon</label>
        </div>
        <div className="flex gap-3 items-center text-sm self-end">
          <button className="flex gap-1 bg-gray text-white px-6 py-2 rounded-3xl">
            Delete
            <img src={deleteIcon} alt="Delete" />
          </button>
          <button className="flex gap-1 bg-blue text-white px-6 py-2 rounded-3xl">
            Save
            <img src={saveIcon} alt="Save" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskOffCanvas;
