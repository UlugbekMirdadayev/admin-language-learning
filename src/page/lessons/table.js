import React from "react";
import { Button, Menu, Table, Flex, Text } from "@mantine/core";
import { PenIcon, Trash } from "../../components/icon";
import ModalScreen from "../../components/modal";
import FormCreate from "./form";
import Reading from "./reading";
import Media from "./media";
import Translation from "./translation";
import Writing from "./writing";
import MultipleChoice from "./multiple-choice";

export default function TableComponent({
  data,
  handleDelete,
  handleGetLessons,
  setLoader,
}) {
  const rows = data?.map((element) => (
    <Table.Tr key={element?.id}>
      <Table.Td>{element?.id}</Table.Td>
      <Table.Td>{element?.index}</Table.Td>
      <Table.Td>
        <Text lineClamp={1}>{element?.title}</Text>
      </Table.Td>
      <Table.Td>
        <Text lineClamp={1}>{element?.description}</Text>
      </Table.Td>
      <Table.Td>
        <Flex gap={"sm"}>
          <Menu
            shadow="md"
            width={150}
            transitionProps={{ transition: "pop", duration: 150 }}
            position="left-start"
          >
            <Menu.Target>
              <Button color={"red"}>
                <Trash fill={"#fff"} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>
                Are you sure you want to delete this lesson?
              </Menu.Label>
              <Menu.Divider />
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

          <ModalScreen
            title={"Edit lesson"}
            btn_title={<PenIcon fill={"#fff"} />}
            body={({ close }) => (
              <FormCreate
                handleUpdate={handleGetLessons}
                setLoader={(boolean) => setLoader(boolean)}
                close={close}
                defaultValues={element}
              />
            )}
          />
        </Flex>
      </Table.Td>
      <Table.Td>
        <ModalScreen
          title={"Reading lesson"}
          btn_title={<PenIcon fill={"#fff"} />}
          body={({ close }) => (
            <Reading
              handleUpdate={handleGetLessons}
              setLoader={(boolean) => setLoader(boolean)}
              close={close}
              defaultValues={element}
              id={element?.id}
            />
          )}
        />
      </Table.Td>
      <Table.Td>
        <ModalScreen
          title={"Media lesson"}
          btn_title={<PenIcon fill={"#fff"} />}
          body={({ close }) => (
            <Media
              handleUpdate={handleGetLessons}
              setLoader={(boolean) => setLoader(boolean)}
              close={close}
              id={element?.id}
            />
          )}
        />
      </Table.Td>
      <Table.Td>
        <ModalScreen
          disabledBtn={!element?.media_items?.id}
          popupBtn={'Media Item Not Found'}
          title={"Translation"}
          btn_title={<PenIcon fill={"#fff"} />}
          body={({ close }) => (
            <Translation
              handleUpdate={handleGetLessons}
              setLoader={(boolean) => setLoader(boolean)}
              close={close}
              id={element?.id}
            />
          )}
        />
      </Table.Td>
      <Table.Td>
        <ModalScreen
          title={"Writing"}
          btn_title={<PenIcon fill={"#fff"} />}
          body={({ close }) => (
            <Writing
              handleUpdate={handleGetLessons}
              setLoader={(boolean) => setLoader(boolean)}
              close={close}
              id={element?.id}
            />
          )}
        />
      </Table.Td>
      <Table.Td>
        <ModalScreen
          disabledBtn={!element?.media_items?.id}
          popupBtn={'Media Item Not Found'}
          title={"Multiple Choice"}
          btn_title={<PenIcon fill={"#fff"} />}
          body={({ close }) => (
            <MultipleChoice
              handleUpdate={handleGetLessons}
              setLoader={(boolean) => setLoader(boolean)}
              close={close}
              id={element?.id}
            />
          )}
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
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
          <Table.Th>Index</Table.Th>
          <Table.Th>Title</Table.Th>
          <Table.Th>Objectivs</Table.Th>
          <Table.Th>Action</Table.Th>
          <Table.Th>Reading</Table.Th>
          <Table.Th>Media</Table.Th>
          <Table.Th>Translation</Table.Th>
          <Table.Th>Writing</Table.Th>
          <Table.Th>Multiple Choice</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data?.length ? (
          rows
        ) : (
          <Table.Tr>
            <Table.Th ta="center" colSpan={5}>
              No data found
            </Table.Th>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
}
