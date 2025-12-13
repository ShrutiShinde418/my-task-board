import { ImSad } from "react-icons/im";

const FallbackComponent = () => {
  return (
    <div className="font-custom flex flex-col items-center gap-1 mt-16">
      <h1 className="text-4xl font-bold uppercase mb-7">
        Something went wrong
      </h1>
      <ImSad className="mb-5 text-5xl" />
      <h2 className="text-xl">An error occurred.</h2>
      <h3 className="text-xl">Please try again later.</h3>
    </div>
  );
};

export default FallbackComponent;
