import React, { useCallback, useEffect } from "react";
import { Button, Flex, Title } from "@mantine/core";
import { useDispatch } from "react-redux";
import TableComponent from "./table";
import { useUsers, useUser } from "../../redux/selectors";
import { setLoader } from "../../redux/loaderSlice";
import { getRequest } from "../../services/api";
import { setReport } from "../../redux/reportSlice";
import { Reload } from "../../components/icon";
import { toast } from "react-toastify";

const Students = () => {
  const user = useUser();
  const dispatch = useDispatch();

  const studentList = useUsers();

  const getReport = useCallback(
    (update) => {
      if (!update) return;
      dispatch(setLoader(true));
      getRequest("/users", user?.token)
        .then(({ data }) => {
          dispatch(setLoader(false));
          dispatch(setReport(data));
        })
        .catch((err) => {
          dispatch(setLoader(false));
          toast.error(JSON.stringify(err?.code || err?.message || err));
        });
    },
    [user?.token, dispatch]
  );

  useEffect(() => {
    if (studentList?.length) return;
    getReport(true);
  }, [getReport, studentList?.length]);

  return (
    <div className="container-page">
      <div>
        <Flex justify={"space-between"} align={"center"}>
          <Title>Users</Title>
          <Button onClick={() => getReport(true)}>
            <Flex align={"center"} gap={10}>
              <Reload fill="#fff" />
              <span>Update data</span>
            </Flex>
          </Button>
        </Flex>
      </div>

      <TableComponent
        data={studentList}
        user={user}
        setLoader={(boolean) => dispatch(setLoader(boolean))}
        getReport={getReport}
      />
    </div>
  );
};

export default Students;
