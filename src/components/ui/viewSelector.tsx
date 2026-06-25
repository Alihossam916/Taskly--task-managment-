"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";
import BoardViewIcon from "@/src/components/icons/boardViewIcon";
import ListViewIcon from "@/src/components/icons/listViewIcon";

const options = [
  { value: "board", label: "Board View", icon: BoardViewIcon },
  { value: "list", label: "List View", icon: ListViewIcon },
];

const ViewSelector = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "board";
  const selected = options.find((o) => o.value === view);

  function handleChange(option: { value: string } | null) {
    if (!option) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", option.value);
    if (option.value === "board") {
      params.delete("page"); // ← reset to page 1
    }
    router.push(`?${params.toString()}`);
  }

  const formatOptionLabel = ({ label, icon: Icon }: (typeof options)[0]) => (
    <div className="flex items-center gap-2 py-0.5">
      <Icon className="size-4" />
      <span>{label}</span>
    </div>
  );

  return (
    <Select
      options={options}
      value={selected}
      onChange={handleChange}
      formatOptionLabel={formatOptionLabel}
      isSearchable={false}
      styles={{
        control: (base) => ({
          ...base,
          height: 48,
          borderRadius: 2,
          borderColor: "#c3c6d6",
          paddingLeft: 12,
          fontSize: 14,
          boxShadow: "none",
          "&:hover": { borderColor: "#c3c6d6" },
          cursor: "pointer",
        }),
        indicatorSeparator: () => ({ display: "none" }),
        dropdownIndicator: (base) => ({ ...base, color: "#041B3C" }),
        menu: (base) => ({ ...base, borderRadius: 2 }),
        option: (base, { isFocused, isSelected }) => ({
          ...base,
          backgroundColor: isSelected
            ? "#d7e2ff"
            : isFocused
              ? "#f1f3ff"
              : "white",
          color: "#041B3C",
          cursor: "pointer",
        }),
      }}
      className="w-full hidden sm:block"
    />
  );
};

export default ViewSelector;
