import logo from "../assets/Logo.svg";
import EditIcon from "../assets/Edit_duotone.svg";
const Header = () => {
  return (
    <>
      <header>
        <img src={logo} alt="Task Board Logo" />
        <h1>My Task Board</h1>
        <button type="button">
          <img src={EditIcon} alt="Edit" />
        </button>
      </header>
      <div>
        <h2>Tasks to keep organised</h2>
      </div>
    </>
  );
};

export default Header;
