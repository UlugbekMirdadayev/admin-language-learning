import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useUser } from "../../redux/selectors";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../services/api";
import { PenIcon, Trash } from "../../components/icon";
import { toast } from "react-toastify";

const inputs = [
  {
    name: "a",
  },
  {
    name: "b",
  },
  {
    name: "c",
  },
  {
    name: "d",
  },
];

const FormCard = ({
  mediaId,
  lessonsId,
  handleUpdate,
  forms,
  close,
  choiceId,
}) => {
  const correct = forms?.answers
    ?.map((answ, index) => {
      return answ?.correct ? { ...answ, index } : false;
    })
    ?.filter(Boolean)[0];
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const form = useForm({
    initialValues: {
      question: forms?.content || "",
      a: forms?.answers[0]?.content || "",
      b: forms?.answers[1]?.content || "",
      c: forms?.answers[2]?.content || "",
      d: forms?.answers[3]?.content || "",
      current: inputs[correct?.index]?.name,
    },
  });

  const onUpdate = (values) => {
    const multiple_question = {
      content: values.question,
      answers_attributes: [
        { content: values.a, correct: values.current === "a" },
        { content: values.b, correct: values.current === "b" },
        { content: values.c, correct: values.current === "c" },
        { content: values.d, correct: values.current === "d" },
      ],
    };
    setLoading(true);
    putRequest(
      `/lessons/${lessonsId}/media_items/${mediaId}/multiple_questions/${choiceId}`,
      { multiple_question },
      user?.token
    )
      .then(({ data }) => {
        setLoading(false);
        handleUpdate(true);
        console.log(data, "data");
        toast.success("Updated");
        form.reset();
        close()
      })
      .catch((err) => {
        setLoading(false);
        console.log(err, "err");
      });
  };

  const handleDelete = () => {
    setLoadingDelete(true);
    deleteRequest(
      `/lessons/${lessonsId}/media_items/${mediaId}/multiple_questions/${choiceId}`,
      user?.token
    )
      .then(({ data }) => {
        setLoadingDelete(false);
        toast.info("Deleted");
        console.log(data);
        handleUpdate(true);
        close();
      })
      .catch((err) => {
        setLoadingDelete(false);
        console.log(err);
        toast.info(JSON.stringify(err?.response?.data || "Error"));
      });
  };
  return (
    <form onSubmit={form.onSubmit(onUpdate)}>
      <details>
        <summary>
          <Flex align={"center"} justify={"space-between"} mt={"md"}>
            <p>{forms?.content}</p>
            <Flex gap={"sm"}>
              <Button
                onClick={handleDelete}
                loading={loadingDelete}
                p={"sm"}
                color="red"
                style={{
                  borderRadius: 4,
                  height: 50,
                }}
              >
                <Trash fill="#fff" />
              </Button>
              <Text
                p={"sm"}
                style={{
                  borderRadius: 4,
                  backgroundColor:
                    "var(--button-bg, var(--mantine-primary-color-filled))",
                  height: 50,
                  cursor: "pointer",
                }}
              >
                <PenIcon fill="#fff" />
              </Text>
            </Flex>
          </Flex>
        </summary>
        <TextInput
          flex={1}
          label={"Question"}
          required
          withAsterisk
          placeholder={"Question"}
          rightSectionWidth={120}
          {...form.getInputProps("question")}
        />
        {forms?.answers?.map((inp, index) => (
          <Flex align={"center"} justify={"space-between"} key={inp.content}>
            <Checkbox
              type="radio"
              mt="md"
              w={55}
              h={35}
              labelPosition="left"
              label={`${inputs[index]?.name})`}
              value={inputs[index]?.name}
              onChange={({ target: { checked } }) => {
                checked &&
                  form.setValues({
                    current: inputs[index]?.name,
                  });
              }}
              checked={form.values.current === inputs[index]?.name}
            />
            <TextInput
              flex={1}
              required
              withAsterisk
              placeholder={"Answer"}
              rightSectionWidth={120}
              defaultValue={inp.content}
            />
          </Flex>
        ))}
        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={loading}>
            Update
          </Button>
        </Group>
      </details>
    </form>
  );
};

function MultipleChoice({ handleUpdate, close, id }) {
  const [loading, setLoading] = useState(false);
  const [mediaId, setMediaId] = useState(null);
  const [listArray, serListArray] = useState([]);

  const user = useUser();
  const form = useForm({
    initialValues: {
      question: "",
      a: "",
      b: "",
      c: "",
      d: "",
      current: "a",
    },
  });

  const onSubmit = (values) => {
    const multiple_question = {
      content: values.question,
      answers_attributes: [
        { content: values.a, correct: values.current === "a" },
        { content: values.b, correct: values.current === "b" },
        { content: values.c, correct: values.current === "c" },
        { content: values.d, correct: values.current === "d" },
      ],
    };
    setLoading(true);
    postRequest(
      `/lessons/${id}/media_items/${mediaId}/multiple_questions`,
      { multiple_question },
      user?.token
    )
      .then(({ data }) => {
        setLoading(false);
        handleUpdate(true);
        console.log(data, "data");
        toast.success("Created");
        form.reset();
        close();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err, "err");
      });
  };

  useEffect(() => {
    setLoading(true);
    getRequest(`/lessons/${id}`, user?.token)
      .then(({ data }) => {
        setMediaId(data?.media_items?.id);
        setLoading(false);
        serListArray(data?.media_items?.multiple_questions);
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
        <TextInput
          flex={1}
          label={"Question"}
          required
          withAsterisk
          placeholder={"Question"}
          rightSectionWidth={120}
          {...form.getInputProps("question")}
        />
        {inputs?.map((inp) => (
          <Flex align={"center"} justify={"space-between"} key={inp.name}>
            <Checkbox
              type="radio"
              mt="md"
              w={55}
              h={35}
              labelPosition="left"
              label={`${inp.name})`}
              value={inp.name}
              onChange={({ target: { checked } }) => {
                checked &&
                  form.setValues({
                    current: inp.name,
                  });
              }}
              checked={form.values.current === inp.name}
            />
            <TextInput
              flex={1}
              required
              withAsterisk
              placeholder={"Answer"}
              rightSectionWidth={120}
              {...form.getInputProps(inp.name)}
            />
          </Flex>
        ))}

        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={loading}>
            Create
          </Button>
        </Group>
      </form>
      {listArray?.map((forms) => (
        <FormCard
          key={forms?.id}
          forms={forms}
          mediaId={mediaId}
          lessonsId={id}
          handleUpdate={handleUpdate}
          choiceId={forms?.id}
          close={close}
        />
      ))}
    </Box>
  );
}

export default MultipleChoice;
