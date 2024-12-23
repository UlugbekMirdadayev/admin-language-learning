/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useState } from "react";
import {
  Table,
  Button,
  Flex,
  Menu,
  Modal,
  Input,
  Group,
  Select,
  Loader,
  PasswordInput,
} from "@mantine/core";
import { PenIcon, Reload, Trash } from "../../components/icon";
import { useForm } from "@mantine/form";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../services/api";
import { toast } from "react-toastify";

export default function TableComponent({ data, user, getReport, lessons }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setID] = useState(null);

  const handleDelete = (id) => {
    setLoading(true);
    deleteRequest(`/user/destroy/${id}`, user?.token)
      .then(() => {
        setLoading(false);
        getReport(true);
        setOpen(false);
        toast.info("Deleted");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(JSON.stringify(err));
      });
  };

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values) => {
    const formData = values;
    delete formData.id;
    delete formData.teacher;
    formData.user_id = id;
    const oldData = data?.find((element) => element?.id === id);
    if (
      oldData?.first_name === formData.first_name &&
      oldData?.last_name === formData.last_name &&
      oldData?.email === formData.email &&
      !formData.password
    ) {
      setOpen(false);
      return;
    }

    // oldData?.first_name === formData.first_name && delete formData.first_name;
    // oldData?.last_name === formData.last_name && delete formData.last_name;
    // oldData?.email === formData.email && delete formData.email;

    setLoading(true);
    putRequest(`/user/update`, formData, user?.token)
      .then(() => {
        setLoading(false);
        getReport(true);
        setOpen(false);
        toast.success("Updated");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(JSON.stringify(err?.response?.data?.message));
      });
  };

  const handleReset = (user_id, lesson_id, setLesson, setLoading, element) => {
    setLoading(element?.id);
    postRequest(`/lessons/${lesson_id}/reset_score`, { user_id }, user?.token)
      .then(({ data }) => {
        setLoading(false);
        toast.info(data?.message);
        setLesson();
      })
      .catch((err) => {
        console.log(err, "err");
        toast.info(JSON.stringify(err?.response?.data || "Error"));
        setLoading(false);
      });
  };

  // const handleRoleChange = (method, setValue) => {
  //   if (method === "true") {
  //     setLoading(true);
  //     postRequest(`/users/${id}/add_teacher_role`, {}, user?.token)
  //       .then(({ data }) => {
  //         setLoading(false);
  //         setValue();
  //         toast.success(data?.message || "Success");
  //         getReport(true);
  //       })
  //       .catch((err) => {
  //         setLoading(false);
  //         toast.error(JSON.stringify(err?.message || err?.response));
  //         console.log(err, "err");
  //       });
  //   }
  //   if (method === "false") {
  //     setLoading(true);
  //     deleteRequest(`/users/${id}/remove_teacher_role`, user?.token)
  //       .then(({ data }) => {
  //         setLoading(false);
  //         setValue();
  //         toast.info(data?.message || "Success");
  //         getReport(true);
  //       })
  //       .catch((err) => {
  //         setLoading(false);
  //         toast.error(JSON.stringify(err?.message || err?.response));
  //         console.log(err, "err");
  //       });
  //   }
  // };

  const Rows = function () {
    return data?.map((element) => {
      const [lesson, setLesson] = useState();
      const [isLesson, setIsLesson] = useState({});
      const [loading, setLoading] = useState(null);
      const testResult = isLesson?.test_result;
      const userAnswers = isLesson?.user_answers;

      const handleGetLesson = useCallback(
        (option) => {
          setLoading(element?.id);
          getRequest(
            `/lessons/${option?.value}/student_results?user_id=${element?.id}`,
            user?.token
          )
            .then(({ data }) => {
              setLesson(option);
              setLoading(null);
              setIsLesson(data);
            })
            .catch((err) => {
              setLoading(null);
              console.log(err);
            });
        },
        [element?.id]
      );

      return (
        <React.Fragment key={element?.id}>
          <Modal
            size="lg"
            title={`Lesson score\n${lesson?.label}`}
            opened={!!lesson?.value}
            onClose={() => setLesson()}
          >
            <Table
              my={"lg"}
              pt={"lg"}
              w={"100%"}
              striped
              highlightOnHover
              withTableBorder
              withColumnBorders
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Completed</Table.Th>
                  <Table.Th>Score</Table.Th>
                  <Table.Th>Test results</Table.Th>
                  <Table.Th>Writing results</Table.Th>
                  <Table.Th>Reset all</Table.Th>
                </Table.Tr>
              </Table.Thead>
              {isLesson?.user_lesson?.lesson_id ? (
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>{isLesson?.user_lesson?.lesson_id}</Table.Td>
                    <Table.Td>
                      {isLesson?.user_lesson?.completed
                        ? "Completed"
                        : "Not Completed"}
                    </Table.Td>
                    <Table.Td>{isLesson?.user_lesson?.score || 0}</Table.Td>
                    <Table.Td>
                      <p>Correct: {testResult?.correct_percentage || 0}%</p>{" "}
                      <p>Wrong: {testResult?.wrong_percentage || 0}%</p>
                    </Table.Td>
                    <Table.Td>
                      {(
                        userAnswers?.reduce(
                          (accumulator, currentValue) =>
                            accumulator + currentValue?.score,
                          0
                        ) / userAnswers?.length || 0
                      ).toFixed(0)}
                      %
                    </Table.Td>
                    <Table.Td>
                      <Menu>
                        <Menu.Target>
                          <Button size="xs">
                            {loading === element?.id ? (
                              <Loader size={"xs"} color="#fff" />
                            ) : (
                              <Reload fill="#fff" />
                            )}
                          </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>Are you sure?</Menu.Label>
                          <Flex>
                            <Menu.Item
                              onClick={() =>
                                handleReset(
                                  element?.id,
                                  isLesson?.user_lesson?.lesson_id,
                                  setLesson,
                                  setLoading,
                                  element
                                )
                              }
                            >
                              Yes
                            </Menu.Item>
                            <Menu.Item>No</Menu.Item>
                          </Flex>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              ) : (
                <Table.Tfoot>
                  <Table.Tr>
                    <Table.Th colSpan={6} ta={"center"}>
                      Data not found
                    </Table.Th>
                  </Table.Tr>
                </Table.Tfoot>
              )}
            </Table>
          </Modal>
          <Table.Tr key={element?.id}>
            <Table.Td>{element?.id}</Table.Td>
            <Table.Td>{element?.first_name}</Table.Td>
            <Table.Td>{element?.last_name}</Table.Td>
            <Table.Td>{element?.email}</Table.Td>
            <Table.Td>
              <Select
                label="Select to view"
                placeholder="Select lesson"
                data={lessons?.map((lesson) => ({
                  label: `${lesson?.index}) ${lesson?.title}`,
                  value: String(lesson?.id),
                }))}
                searchable
                onChange={(_, option) => handleGetLesson(option)}
                allowDeselect={false}
                value={lesson?.value}
                disabled={loading === element?.id}
                leftSection={
                  loading === element?.id ? (
                    <Loader size={"xs"} color="gray" />
                  ) : null
                }
              />
            </Table.Td>
            <Table.Td style={{ textTransform: "capitalize" }}>
              {element?.role?.name}
            </Table.Td>
            <Table.Td>
              <Flex gap="sm">
                <Button
                  size="xs"
                  color="blue"
                  onClick={() => {
                    form.setValues({
                      first_name: element?.first_name || "",
                      last_name: element?.last_name || "",
                      email: element?.email || "",
                    });
                    setID(element?.id);
                    setOpen(true);
                  }}
                >
                  <PenIcon fill="#fff" />
                </Button>
                <Menu>
                  <Menu.Target>
                    <Button size="xs" color="red">
                      <Trash fill="#fff" />
                    </Button>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Are you sure?</Menu.Label>
                    <Flex>
                      <Menu.Item
                        onClick={() => handleDelete(element?.id)}
                        color="red"
                      >
                        Yes
                      </Menu.Item>
                      <Menu.Item>No</Menu.Item>
                    </Flex>
                  </Menu.Dropdown>
                </Menu>
              </Flex>
            </Table.Td>
          </Table.Tr>
        </React.Fragment>
      );
    });
  };

  return (
    <>
      <Modal
        opened={open}
        onClose={() => {
          form.reset();
          setOpen(false);
        }}
        title="Edit user"
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Input.Wrapper label="Name">
            <Input {...form.getInputProps("first_name")} />
          </Input.Wrapper>
          <Input.Wrapper label="Surname">
            <Input {...form.getInputProps("last_name")} />
          </Input.Wrapper>
          <Input.Wrapper label="E-mail">
            <Input {...form.getInputProps("email")} />
          </Input.Wrapper>
          <Input.Wrapper label="Password">
            <PasswordInput {...form.getInputProps("password")} />
          </Input.Wrapper>
          {/* <Select
            label="Role"
            data={[
              {
                label: "Teacher",
                value: "true",
              },
              {
                label: "Student",
                value: "false",
              },
            ]}
            {...form.getInputProps("teacher")}
            onChange={(event) => {
              handleRoleChange(event, () =>
                form.getInputProps("teacher").onChange(event)
              );
            }}
            allowDeselect={false}
            rightSection={loading ? <Loader size={"xs"} color="gray" /> : null}
          /> */}
          <Group justify="flex-end" mt={"sm"}>
            <Button type="submit" loading={loading}>
              Update
            </Button>
          </Group>
        </form>
      </Modal>
      <Table
        my={"lg"}
        pt={"lg"}
        w={"100%"}
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>First name</Table.Th>
            <Table.Th>Last name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Lessons</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Control</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.length ? (
            <Rows />
          ) : (
            <Table.Tr>
              <Table.Th ta={"center"} colSpan={7}>
                No data found
              </Table.Th>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </>
  );
}
