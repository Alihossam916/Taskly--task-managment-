import React from "react";

const Loading = () => {
  return (
    <div className="mb-20 mt-5 animate-pulse">
      {/* bread crambs */}
      <div className="hidden sm:flex items-center gap-2">
        <div className="bg-surface-highest h-4 w-20"></div>
        <span className="text-surface-highest">/</span>
        <div className="bg-surface-highest h-4 w-32"></div>
      </div>
      {/* title */}
      <div className="flex items-center justify-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="bg-surface-highest h-10 w-72"></h1>
          <div className="w-96 h-4 bg-surface-highest hidden sm:block"></div>
        </div>
        <div className="hidden sm:flex w-fit items-center gap-2 rounded-xs!">
          <div className="hidden sm:inline bg-surface-highest w-32 h-10"></div>
        </div>
      </div>
      {/* Desktop table */}
      <div className="hidden sm:flex items-center justify-between mt-20 p-6 bg-white">
        <div className="flex flex-col items-center gap-14">
          <div className="w-10 h-4 bg-surface-highest"></div>
          <div className="w-10 h-10 rounded-md bg-surface-highest"></div>
          <div className="w-10 h-10 rounded-md bg-surface-highest"></div>
          <div className="w-10 h-10 rounded-md bg-surface-highest"></div>
          <div className="w-10 h-10 rounded-md bg-surface-highest"></div>
          <div className="w-10 h-10 rounded-md bg-surface-highest"></div>
        </div>
        <div className="flex flex-col items-start gap-18">
          <div className="w-32 h-4 bg-surface-highest"></div>
          <div className="w-52 h-6 rounded-xs bg-surface-highest"></div>
          <div className="w-52 h-6 rounded-xs bg-surface-highest"></div>
          <div className="w-52 h-6 rounded-xs bg-surface-highest"></div>
          <div className="w-52 h-6 rounded-xs bg-surface-highest"></div>
          <div className="w-52 h-6 rounded-xs bg-surface-highest"></div>
        </div>
        <div className="flex flex-col items-start gap-18">
          <div className="w-28 h-4 bg-surface-highest"></div>
          <div className="w-52 h-5 rounded-xs bg-surface-highest"></div>
          <div className="w-52 h-5 rounded-xs bg-surface-highest"></div>
          <div className="w-52 h-5 rounded-xs bg-surface-highest"></div>
          <div className="w-52 h-5 rounded-xs bg-surface-highest"></div>
          <div className="w-52 h-5 rounded-xs bg-surface-highest"></div>
        </div>
        <div className="flex flex-col items-start gap-15">
          <div className="w-24 h-4 bg-surface-highest"></div>
          <div className="w-22 rounded-l-full rounded-r-full h-7 bg-surface-highest"></div>
          <div className="w-22 rounded-l-full rounded-r-full h-7 bg-surface-highest"></div>
          <div className="w-22 rounded-l-full rounded-r-full h-7 bg-surface-highest"></div>
          <div className="w-22 rounded-l-full rounded-r-full h-7 bg-surface-highest"></div>
          <div className="w-22 rounded-l-full rounded-r-full h-7 bg-surface-highest"></div>
        </div>
        <div className="flex flex-col items-start gap-16">
          <div className="w-28 h-4 bg-surface-highest invisible"></div>
          <div className="w-6 h-6 rounded-xs bg-surface-highest"></div>
          <div className="w-6 h-6 rounded-xs bg-surface-highest"></div>
          <div className="w-6 h-6 rounded-xs bg-surface-highest"></div>
          <div className="w-6 h-6 rounded-xs bg-surface-highest"></div>
          <div className="w-6 h-6 rounded-xs bg-surface-highest"></div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-8 mt-6">
        {/* members */}
        <div className="bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-15 h-15 bg-surface-highest"></div>
            <div className="space-y-2">
              <div className="w-40 h-6 rounded-xs bg-surface-highest"></div>
              <div className="w-52 h-6 rounded-xs bg-surface-highest"></div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-28 h-4 bg-surface-highest"></div>
            <div className="w-4 h-4 bg-surface-highest"></div>
          </div>
        </div>
        <div className="bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-15 h-15 bg-surface-highest"></div>
            <div className="space-y-2">
              <div className="w-40 h-6 rounded-xs bg-surface-highest"></div>
              <div className="w-52 h-6 rounded-xs bg-surface-highest"></div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-28 h-4 bg-surface-highest"></div>
            <div className="w-4 h-4 bg-surface-highest"></div>
          </div>
        </div>
        <div className="bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-15 h-15 bg-surface-highest"></div>
            <div className="space-y-2">
              <div className="w-40 h-6 rounded-xs bg-surface-highest"></div>
              <div className="w-52 h-6 rounded-xs bg-surface-highest"></div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-28 h-4 bg-surface-highest"></div>
            <div className="w-4 h-4 bg-surface-highest"></div>
          </div>
        </div>
        <div className="bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-15 h-15 bg-surface-highest"></div>
            <div className="space-y-2">
              <div className="w-40 h-6 rounded-xs bg-surface-highest"></div>
              <div className="w-52 h-6 rounded-xs bg-surface-highest"></div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-28 h-4 bg-surface-highest"></div>
            <div className="w-4 h-4 bg-surface-highest"></div>
          </div>
        </div>
        <div className="bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-15 h-15 bg-surface-highest"></div>
            <div className="space-y-2">
              <div className="w-40 h-6 rounded-xs bg-surface-highest"></div>
              <div className="w-52 h-6 rounded-xs bg-surface-highest"></div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-28 h-4 bg-surface-highest"></div>
            <div className="w-4 h-4 bg-surface-highest"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
