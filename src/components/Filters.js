import { Group, Select } from "@mantine/core";
import React, { useEffect } from "react";
import { DateRangePicker, DateRangePickerValue } from "@mantine/dates";

// The Filters component takes setFilters and filters functions as arguments and
// returns a Group component containing two Select components and a DateRangePicker component.
function Filters({ setFilters, filters }) {
  return (
    <Group>
      {/* The Select components allow the user to filter the data by time period and transaction type, 
      and the DateRangePicker component allows the user to choose a custom date range. When the user 
      makes a selection, the setFilters function is called with the updated filters. */}
      <Select
        label="Time period"
        placeholder="Select Frequency"
        data={[
          { label: "Previous Week", value: "7" },
          { label: "Previous Month", value: "30" },
          { label: "Previous Year", value: "365" },
          { label: "Custom Range", value: "custom-range" },
        ]}
        value={filters.frequency}
        onChange={(value) => setFilters({ ...filters, frequency: value })}
        name="frequency"
      />
      {filters.frequency === "custom-range" && (
        <div className="w-full">
          <DateRangePicker
            sx={{ width: "350px" }}
            label="Select Date Range"
            placeholder="Pick dates range"
            zIndex={10000}
            dropdownPosition="bottom"
            fullWidth
            onChange={(value) => setFilters({ ...filters, dateRange: value })}
          />
        </div>
      )}
      <Select
        label="Transaction type"
        placeholder="Select Type"
        data={[
          { label: "All", value: "" },
          { label: "Income", value: "income" },
          { label: "Expense", value: "expense" },
        ]}
        value={filters.type}
        onChange={(value) => setFilters({ ...filters, type: value })}
        name="type"
        dropdownPosition="bottom"
      />
    </Group>
  );
}

export default Filters;
