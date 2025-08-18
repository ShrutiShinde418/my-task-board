import logo from "../assets/Logo.svg";
import EditIcon from "../assets/Edit_duotone.svg";
const Header = () => {
  return (
    <>
      <header className="flex items-center gap-3">
        <img src={logo} alt="Task Board Logo" />
        <h1 className="text-4xl font-normal">My Task Board</h1>
        <button type="button">
          <img src={EditIcon} alt="Edit" />
        </button>
      </header>
      <div className="ml-14 mt-4">
        <h2 className="font-normal">Tasks to keep organised</h2>
      </div>
    </>
  );
};

export default Header;
