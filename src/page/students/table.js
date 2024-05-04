import React, { useState } from "react";
import { Table, Button, Flex, Menu, Modal, Input, Group } from "@mantine/core";
import { PenIcon, Trash } from "../../components/icon";
import { useForm } from "@mantine/form";
import { deleteRequest, putRequest } from "../../services/api";
import { toast } from "react-toastify";

export default function TableComponent({ data, user, getReport }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setID] = useState(null);
  const handleDelete = (id) => {
    setLoading(true);
    deleteRequest(`/users/${id}`, user?.token)
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
      name: "",
      surname: "",
      email: "",
    },
  });

  const onSubmit = (values) => {
    const formData = values;
    console.log(values);
    delete formData.id;
    setLoading(true);
    putRequest(`/users/${id}`, { user: formData }, user?.token)
      .then(() => {
        setLoading(false);
        getReport(true);
        setOpen(false);
        getReport(true);
        toast.success("Updated");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(JSON.stringify(err));
      });
  };

  const rows = data?.map((element) => (
    <Table.Tr key={element?.id}>
      <Table.Td>{element?.id}</Table.Td>
      <Table.Td>{element?.name}</Table.Td>
      <Table.Td>{element?.surname}</Table.Td>
      <Table.Td>{element?.email}</Table.Td>
      <Table.Td>{element?.teacher ? "Teacher" : "Student"}</Table.Td>
      <Table.Td>
        <Flex gap="sm">
          <Button
            size="xs"
            color="blue"
            onClick={() => {
              form.setValues({
                name: element?.name || "",
                surname: element?.surname || "",
                email: element?.email || "",
              });
              setID(element?.id);
              setOpen(true);
            }}
          >
            <PenIcon fill="#fff" />
          </Button>
          <Menu disabled={element?.teacher}>
            <Menu.Target>
              <Button size="xs" color="red">
                <Trash fill="#fff" />
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Are you sure?</Menu.Label>
              <Flex>
                <Menu.Item
                  onClick={() =>
                    element?.teacher ? null : handleDelete(element?.id)
                  }
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
  ));

  return (
    <>
      <Modal opened={open} onClose={() => setOpen(false)} title="Edit user">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Input.Wrapper label="Name">
            <Input {...form.getInputProps("name")} />
          </Input.Wrapper>
          <Input.Wrapper label="Surname">
            <Input {...form.getInputProps("surname")} />
          </Input.Wrapper>
          <Input.Wrapper label="E-mail">
            <Input {...form.getInputProps("email")} />
          </Input.Wrapper>
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
            <Table.Th>Role</Table.Th>
            <Table.Th>Control</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.length ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Th ta={"center"} colSpan={5}>
                No data found
              </Table.Th>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </>
  );
}
