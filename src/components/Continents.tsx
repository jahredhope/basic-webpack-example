import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { memo } from "react";
import Loader from "./Loader";
import Text from "./Text";
import Stack from "./Stack";

const CONTINENTS_QUERY = gql`
  {
    continents {
      name
    }
  }
`;

const Continents = () => {
  const { loading, error, data } = useQuery(CONTINENTS_QUERY);
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <Text>Unable to load continents</Text>;
  }
  return (
    <Stack as="ul" space="xsmall">
      {data &&
        data.continents.map((continent: any, index: number) => (
          <li key={index}>
            <Text>{continent.name}</Text>
          </li>
        ))}
    </Stack>
  );
};

export default memo(Continents);
