import React from "react";
import { Header } from "./Header";
import BookListContainer from "./BookListContainer";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store: any) => store.auth);
  if (!user) {
    navigate("/login");
  }

  return (
    user && (
      <>
        <Header username={user.name} admin={user.admin} />
        <BookListContainer userId={user.id} availableOnly={false} />
        {/* <BookListContainer availableOnly={true} /> */}
      </>
    )
  );
};

export default Dashboard;
