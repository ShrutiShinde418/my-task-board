import { ImSad } from "react-icons/im";
import { Link } from "react-router-dom";

const NoMatch = () => {
  return (
    <div className="font-custom flex flex-col items-center gap-1 mt-16">
      <h1 className="text-4xl font-bold uppercase mb-7">
        404 – Page Not Found
      </h1>
      <ImSad className="mb-5 text-5xl" />
      <h2 className="text-xl">We couldn’t find the page you’re looking for.</h2>
      <Link to="/" className="mt-5">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NoMatch;
