import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Group, Input, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { toast } from "react-toastify";
import { useUser } from "../../redux/selectors";
import { getRequest, postRequest, putRequest } from "../../services/api";
import { PlusIcon, Minus } from "../../components/icon";

function Translation({ handleUpdate, close, id }) {
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [index, setIndex] = useState(1);
  const user = useUser();
  const form = useForm({
    initialValues: {
      eng: [],
      uzb: [],
    },
  });

  const onSubmit = (values) => {
    console.log(values, "values");
  };

  //   useEffect(() => {
  //     setLoading(true);
  //     getRequest("/lessons/" + id, user?.token)
  //       .then(({ data }) => {
  //         setLoading(false);
  //         setUpdate(data?.media_item?.id ? data?.media_item : false);
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         console.log(error, "error");
  //       });
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [id, user?.token]);

  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit(onSubmit)}>
        {Array.from({ length: index }).map((_, item) => (
          <React.Fragment key={item}>
            <Flex justify={"space-between"} mt={10} ta={"center"}>
              <Input.Wrapper flex={0.45} label="UZB">
                <Input {...form.getInputProps(`uzb.${item}`)} />
              </Input.Wrapper>
              <Input.Wrapper flex={0.45} label="ENG">
                <Input {...form.getInputProps(`eng.${item}`)} />
              </Input.Wrapper>
            </Flex>
            {index > 1 ? (
              <Flex justify={"center"} mt={20}>
                <Button onClick={() => setIndex(index - 1)}>
                  <Minus fill="#fff" />
                </Button>
              </Flex>
            ) : null}
          </React.Fragment>
        ))}
        <Flex justify={"center"} mt={20}>
          <Button onClick={() => setIndex(index + 1)}>
            <PlusIcon fill="#fff" />
          </Button>
        </Flex>
        <Group justify="flex-end" mt="sm">
          <Button type="submit" loading={loading}>
            Yuborish
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default Translation;
