import React, { useCallback, useEffect } from "react";
import TableComponent from "./table";
import { useLessons, useUser } from "../../redux/selectors";
import { useDispatch } from "react-redux";
import { setLoader } from "../../redux/loaderSlice";
import { getRequest } from "../../services/api";
import { toast } from "react-toastify";
import { Button, Flex, Title } from "@mantine/core";
import { setLessons } from "../../redux/lessonSlice";
import ModalScreen from "../../components/modal";
import FormCreate from "./form";
import { handleDelete } from "../../utils/helpers";
import { PlusIcon, Reload } from "../../components/icon";

const Lessons = () => {
  const user = useUser();
  const lessons = useLessons();

  const dispatch = useDispatch();

  const handleGetLessons = useCallback(
    (update) => {
      if (!update && lessons?.length) return;
      dispatch(setLoader(true));
      getRequest("/lesson/all", user?.token)
        .then(({ data }) => {
          dispatch(setLoader(false));
          dispatch(
            setLessons(data?.result?.sort((a, b) => a?.index - b?.index))
          );
        })
        .catch((err) => {
          dispatch(setLoader(false));
          toast.error(JSON.stringify(err?.code || err?.message || err));
        });
    },
    [dispatch, lessons?.length, user?.token]
  );

  useEffect(() => {
    handleGetLessons();
  }, [handleGetLessons]);

  return (
    <div className="container-page">
      <Flex
        style={{ zIndex: 9 }}
        justify={"space-between"}
        align={"center"}
        pos={"sticky"}
        top={0}
        bg={"#fff"}
      >
        <Title>Lessons</Title>
        <Button onClick={() => handleGetLessons(true)}>
          <Flex align={"center"} gap={10}>
            <Reload fill="#fff" />
            <span>Update data</span>
          </Flex>
        </Button>
        <ModalScreen
          title={"Add new lessons"}
          btn_title={
            <Flex align={"center"} gap={10}>
              <PlusIcon fill="#fff" /> <span>Add new lessons</span>
            </Flex>
          }
          body={({ close }) => (
            <FormCreate
              handleUpdate={handleGetLessons}
              setLoader={(boolean) => dispatch(setLoader(boolean))}
              close={close}
            />
          )}
        />
      </Flex>
      <TableComponent
        data={lessons}
        user={user}
        handleDelete={(id) =>
          handleDelete(
            `room/delete/${id}`,
            (boolean) => dispatch(setLoader(boolean)),
            handleGetLessons,
            user?.token
          )
        }
        handleGetLessons={handleGetLessons}
        dispatch={dispatch}
        setLoader={(boolean) => dispatch(setLoader(boolean))}
      />
    </div>
  );
};

export default Lessons;
