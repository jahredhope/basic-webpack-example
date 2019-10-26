import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { memo } from "react";

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
    return <div>...loading</div>;
  }
  if (error) {
    return <div>Unable to load continents</div>;
  }
  return (
    <ul>
      {data &&
        data.continents.map((continent: any, index: number) => (
          <li key={index}>{continent.name}</li>
        ))}
    </ul>
  );
};

export default memo(Continents);
