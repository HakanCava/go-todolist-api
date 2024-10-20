import React, { ReactNode } from "react";
import Navbar from "./(Home)/_components/Navbar";

const template = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default template;
