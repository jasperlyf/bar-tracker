import React from "react";
import BarForm from "../components/BarForm";
import VisitTable from "../components/VisitTable";

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
        <BarForm />
        <VisitTable /> 
    </div>
  );
};

export default Home;
