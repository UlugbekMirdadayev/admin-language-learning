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
import { getRequest, postRequest } from "../../services/api";
import { PenIcon } from "../../components/icon";

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

const FormCard = ({ mediaId, lessonsId, handleUpdate, forms }) => {
  const correct = forms?.answers.find(({ correct }) => correct);
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      question: forms?.content || "",
      a: forms?.answers[0]?.content || "",
      b: forms?.answers[1]?.content || "",
      c: forms?.answers[2]?.content || "",
      d: forms?.answers[3]?.content || "",
      current: correct?.id,
    },
  });

  const onUpdate = (values) => {
    if (values) return console.log(values);
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
      `/lessons/${lessonsId}/media_items/${mediaId}/multiple_questions`,
      { multiple_question },
      user?.token
    )
      .then(({ data }) => {
        setLoading(false);
        handleUpdate(true);
        console.log(data, "data");
        form.reset();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err, "err");
      });
  };
  return (
    <form onSubmit={form.onSubmit(onUpdate)}>
      <details>
        <summary>
          <Flex align={"center"} justify={"space-between"} mt={"md"}>
            <p>{forms?.content}</p>
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
              label={`${inputs[index].name})`}
              value={inp.content}
              onChange={({ target: { checked } }) => {
                checked &&
                  form.setValues({
                    current: inp.content,
                  });
              }}
              checked={form.values.current === inp.content}
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
        {inputs.map((inp) => (
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
      {listArray.map((forms) => (
        <FormCard
          key={forms?.id}
          forms={forms}
          mediaId={mediaId}
          lessonsId={id}
          handleUpdate={handleUpdate}
        />
      ))}
    </Box>
  );
}

export default MultipleChoice;
