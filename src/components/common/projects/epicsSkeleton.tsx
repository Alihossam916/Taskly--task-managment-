import React from "react";

const EpicsSkeleton = () => {
  const displayEpics = [1, 2, 3, 4, 5, 6];
  return (
    <div className="mb-30 mt-5 animate-pulse">
      <div className="hidden sm:flex items-center gap-2">
        <div className="bg-surface-highest w-20 h-4"></div>
        <span>{">"}</span>
        <div className="bg-surface-highest w-24 h-4"></div>
      </div>
      <div className="flex items-center justify-center sm:justify-between mt-5">
        <h1 className="hidden sm:block bg-surface-highest w-40 h-8"></h1>
        <div className="flex items-center gap-5 w-full sm:w-fit">
          <div className="hidden sm:block bg-surface-highest w-40 h-8"></div>
          <div className="hidden sm:block bg-surface-highest w-40 h-8"></div>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
        {/* epics display */}
        {displayEpics.map((index) => {
          return (
            <div key={index} className="bg-white rounded-xs p-4 space-y-4">
              <section className="flex items-center justify-between">
                <h6 className="bg-surface-highest w-24 h-8"></h6>
                <div className="w-10 h-10 bg-surface-highest rounded-xl" />
              </section>
              <h3 className="bg-surface-highest w-full h-8"></h3>
              <section className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-surface-highest size-12 rounded-xl"></div>
                  <div className="flex flex-col-reverse sm:flex-col">
                    <p className="w-40 h-6 bg-surface-highest"></p>
                  </div>
                </div>
              </section>
              <hr className="w-full h-2 bg-surface-highest border-none" />
              <section className="hidden sm:flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="bg-surface-highest h-6 w-24"></p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="bg-surface-highest h-6 w-24"></p>
                </div>
              </section>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default EpicsSkeleton;
