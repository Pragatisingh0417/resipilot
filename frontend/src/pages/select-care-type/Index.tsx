import { useNavigate } from "react-router-dom";

const SelectCareTypePage = () => {
  const navigate = useNavigate();

  const handleSelect = (type: "foster" | "group-home") => {
    // optional: store selection
    localStorage.setItem("careType", type);

    if (type === "foster") {
      navigate("/foster/dashboard");
    } else {
      navigate("/group-home/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-5xl w-full">
        
        <h1 className="text-3xl font-bold text-center mb-10">
          Choose Care Type
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Foster Card */}
          <div
            onClick={() => handleSelect("foster")}
            className="cursor-pointer p-8 rounded-2xl bg-white shadow-md hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold mb-3">
              Foster Care Agency
            </h2>
            <p className="text-gray-600">
              Manage foster families, children, and placements.
            </p>
          </div>

          {/* Group Home Card */}
          <div
            onClick={() => handleSelect("group-home")}
            className="cursor-pointer p-8 rounded-2xl bg-white shadow-md hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold mb-3">
              Group Home
            </h2>
            <p className="text-gray-600">
              Manage residential homes, staff, and multiple children.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SelectCareTypePage;