import React from "react";
import { Loader } from "@mantine/core";
// The Spinner component can be used to indicate that a web application is currently processing a request or loading data.
//  It provides visual feedback to the user, letting them know that the application is still working and that they should wait
//  for the process to complete.
function Spinner() {
  return (
    <div>
      {/* Loader component has a size of "lg" (large) and a variant of "bars", 
      which displays a series of rotating bars to indicate that something is loading. */}
      <Loader size="lg" variant="bars" />
    </div>
  );
}

export default Spinner;
