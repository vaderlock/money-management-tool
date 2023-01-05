import { Card, Group, Text } from "@mantine/core";
import React from "react";

// The Header component retrieves the user's name from localStorage and displays it in a Card component,
// along with an icon indicating the type of application.
function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      {/* The Card component contains a div element with a className of flex justify-between, 
      which positions the user's name and logout icon on the same line.  */}
      <Card shadow="md" p={25} withBorder color="">
        <div className="flex justify-between">
          <Text size="xl" color="orange" variant="text" weight="bold">
            money management tool
            <i class="ri-money-dollar-box-line"></i>
            {/* <i class="ri-tools-line"></i> */}
          </Text>
          <Group>
            {user?.fname}
            <i
              className="ri-logout-box-line"
              // The user can click on a logout icon to remove their user data from localStorage and refresh the page.
              onClick={() => {
                localStorage.removeItem("user");
                window.location.reload();
              }}
            ></i>
          </Group>
        </div>
      </Card>
    </div>
  );
}

export default Header;
