import React from "react";
import { Oval } from "react-loader-spinner";

const Spinner = () => {
  return (
    <div
      className="loader-container mt-5"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Oval
        height={80}
        width={80}
        color="#3b82f6"
        ariaLabel="loading"
        secondaryColor="#3b82f620"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default Spinner;
