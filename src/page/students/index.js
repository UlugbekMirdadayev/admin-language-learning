import React, { useCallback, useEffect } from "react";
import { Button, Flex, Title } from "@mantine/core";
import { useDispatch } from "react-redux";
import TableComponent from "./table";
import { useUsers, useUser, useLessons } from "../../redux/selectors";
import { setLoader } from "../../redux/loaderSlice";
import { getRequest } from "../../services/api";
import { setReport } from "../../redux/reportSlice";
import { Reload } from "../../components/icon";
import { toast } from "react-toastify";
import { setLessons } from "../../redux/lessonSlice";

const Students = () => {
  const user = useUser();
  const dispatch = useDispatch();

  const studentList = useUsers();
  const lessons = useLessons();

  const getReport = useCallback(
    (update) => {
      if (!update) return;
      dispatch(setLoader(true));
      getRequest("/users", user?.token)
        .then(({ data }) => {
          dispatch(setLoader(false));
          dispatch(setReport(data?.filter((users) => users?.id !== user?.id)?.sort((a, b) => a?.teacher - b?.teacher)));
        })
        .catch((err) => {
          dispatch(setLoader(false));
          toast.error(JSON.stringify(err?.code || err?.message || err));
        });
    },
    [user?.token, dispatch, user?.id]
  );

  const handleGetLessons = useCallback(
    (update) => {
      if (!update && lessons?.length) return;
      dispatch(setLoader(true));
      getRequest("/lessons", user?.token)
        .then(({ data }) => {
          dispatch(setLoader(false));
          dispatch(setLessons(data?.sort((a, b) => a?.index - b?.index)));
        })
        .catch((err) => {
          dispatch(setLoader(false));
          toast.error(JSON.stringify(err?.code || err?.message || err));
        });
    },
    [dispatch, lessons?.length, user?.token]
  );

  useEffect(() => {
    if (studentList?.length) return;
    getReport(true);
  }, [getReport, studentList?.length]);

  useEffect(() => {
    if (lessons?.length) return;
    handleGetLessons(true);
  }, [handleGetLessons, lessons?.length]);

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
        lessons={lessons}
      />
    </div>
  );
};

export default Students;
