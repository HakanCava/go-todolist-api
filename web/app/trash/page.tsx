import React from "react";
import TrashTodoTables from "./_components/TrashTodoTables";

const TrashPage = () => {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-10 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <h2 className="text-5xl">Trash Todos</h2>
      </div>
      <div>
        <TrashTodoTables />
      </div>
    </div>
  );
};

export default TrashPage;
