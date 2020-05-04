import React, { memo } from "react";
import { useToggler } from "src/common-hooks";
import Card from "src/components/Card";
import Link from "src/components/Link";
import Text from "src/components/Text";

function ShowMore() {
  const [showMore, toggleShowMore] = useToggler(false);
  return (
    <Card>
      <Link
        name="show-more"
        href="#"
        onClick={(event) => {
          event.preventDefault();
          toggleShowMore();
        }}
      >
        <Text link>Show more</Text>
      </Link>
      {showMore && <Text secondary>More</Text>}
    </Card>
  );
}

export default memo(ShowMore);
