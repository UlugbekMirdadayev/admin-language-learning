import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Group, Input } from "@mantine/core";
import { useForm } from "@mantine/form";
import { toast } from "react-toastify";
import { useUser } from "../../redux/selectors";
import { getRequest, postRequest } from "../../services/api";
import { PlusIcon, Minus } from "../../components/icon";

function Translation({ handleUpdate, close, id }) {
  const [loading, setLoading] = useState(false);
  const [mediaItem, setMediaItem] = useState({});
  const [values, setvalues] = useState({ eng: [""], uzb: [""] });
  const user = useUser();
  const form = useForm({
    initialValues: {
      eng: [],
      uzb: [],
    },
  });

  const onSubmit = () => {
    const array_of_objects = values.uzb.map((uzbWord, index) => ({
      [uzbWord]: values.eng[index],
    }));
    postRequest(
      `/lessons/${id}/media_items/${mediaItem?.id}/translations`,
      { translation: { array_of_objects } },
      user?.token
    )
      .then(({ data }) => {
        console.log(data, "data");
        toast.success("Created");
        handleUpdate(true);
        close();
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(JSON.stringify(err));
      });
  };

  const onChange = (value, type, ind) => {
    if (type === "uzb") {
      setvalues({
        uzb: [...values.uzb.map((_, _index) => (ind === _index ? value : _))],
        eng: [...values.eng],
      });
    }
    if (type === "eng") {
      setvalues({
        uzb: [...values.uzb],
        eng: [...values.eng.map((_, _index) => (ind === _index ? value : _))],
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    getRequest("/lessons/" + id, user?.token)
      .then(({ data }) => {
        if (data?.media_items?.translations?.length) {
          setvalues({
            uzb: [
              ...data?.media_items?.translations
                ?.map((item) => item?.array_of_objects)
                ?.flat()
                ?.map((item) => {
                  const obj = Object.keys(item);
                  return `${obj[0]}`;
                }),
            ],
            eng: [
              ...data?.media_items?.translations
                ?.map((item) => item?.array_of_objects)
                ?.flat()
                ?.map((item) => {
                  const obj = Object.values(item);
                  return `${obj[0]}`;
                }),
            ],
          });
        }
        setLoading(false);
        if (data?.media_items?.id) {
          setMediaItem(data?.media_items);
        } else {
          close();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error, "error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.token]);

  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit(onSubmit)}>
        {Array.from({ length: values.uzb.length }).map((_, item) => (
          <React.Fragment key={item}>
            <Flex
              justify={"space-between"}
              mt={10}
              ta={"center"}
              align={"flex-end"}
              gap={"sm"}
            >
              <Input.Wrapper flex={0.45} label="UZB">
                <Input
                  required
                  onChange={({ target: { value } }) =>
                    onChange(value, "uzb", item)
                  }
                  value={values.uzb[item]}
                />
              </Input.Wrapper>
              <Input.Wrapper flex={0.45} label="ENG">
                <Input
                  required
                  onChange={({ target: { value } }) =>
                    onChange(value, "eng", item)
                  }
                  value={values.eng[item]}
                />
              </Input.Wrapper>

              <Button
                flex={0.1}
                disabled={values.uzb.length === 1 || values.eng.length === 1}
                onClick={() => {
                  setvalues({
                    uzb: [...values.uzb.filter((_, index) => index !== item)],
                    eng: [...values.eng.filter((_, index) => index !== item)],
                  });
                }}
              >
                <Minus fill="#fff" />
              </Button>
            </Flex>
            {values.uzb.length - 1 === item ? (
              <Flex justify={"center"} mt={20}>
                <Button
                  onClick={() =>
                    setvalues({
                      uzb: [...values.uzb, ""],
                      eng: [...values.eng, ""],
                    })
                  }
                >
                  <PlusIcon fill="#fff" />
                </Button>
              </Flex>
            ) : null}
          </React.Fragment>
        ))}

        <Group
          justify="flex-end"
          mt="sm"
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 8,
            background: "#fff",
            padding: "16px 0",
          }}
        >
          <Button type="submit" loading={loading}>
            Yuborish
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default Translation;
