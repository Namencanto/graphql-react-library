import React from "react";
import { Header } from "./Header";
import BookListContainer from "./BookListContainer";

const Dashboard = () => {
  return (
    <>
      <Header username="Warchlaczyna" />
      <BookListContainer userId={1} availableOnly={false} />
      <BookListContainer availableOnly={true} />
    </>
  );
};

export default Dashboard;
