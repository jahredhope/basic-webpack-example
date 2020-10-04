import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { memo } from "react";
import Loader from "./Loader";
import Stack from "./Stack";
import Text from "./Text";

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
