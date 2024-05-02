import React, { useState } from "react";
import { Table, Button, Flex, Menu, Modal } from "@mantine/core";
import { PenIcon, Trash } from "../../components/icon";
import { useForm } from "@mantine/form";

export default function TableComponent({ data, user }) {
  const [open, setOpen] = useState(false);
  const handleDelete = (id) => {
    alert(id);
  };

  const { onSubmit } = useForm({
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const EditModal = () => {
    return (
      <Modal opened={open} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit}></form>
      </Modal>
    );
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
          <Button size="xs" color="blue" onClick={() => setOpen(true)}>
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
  ));

  return (
    <>
      <EditModal />
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
