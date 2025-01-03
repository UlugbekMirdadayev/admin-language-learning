import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
// import { useUser } from "../../redux/selectors";
import // deleteRequest,
// getRequest,
// postRequest,
// putRequest,
"../../services/api";
import { PenIcon, Trash } from "../../components/icon";
// import { toast } from "react-toastify";

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
  {
    name: "e",
  },
];

const FormCard = ({
  mediaId,
  lessonsId,
  handleUpdate,
  forms,
  close,
  choiceId,
  index,
}) => {
  const correct = forms?.answers
    ?.sort((a, b) => a?.id - b?.id)
    ?.map((answ, index) => {
      return answ?.correct ? { ...answ, index } : false;
    })
    ?.filter(Boolean)[0];
  // const user = useUser();
  // const [loading, setLoading] = useState(false);
  // const [loadingDelete, setLoadingDelete] = useState(false);
  const form = useForm({
    initialValues: {
      question: forms?.question || "",
      a: forms?.tests?.[0]?.option || "",
      b: forms?.tests?.[1]?.option || "",
      c: forms?.tests?.[2]?.option || "",
      d: forms?.tests?.[3]?.option || "",
      current: inputs[correct?.index]?.name,
      a_id: forms?.tests?.[0]?.id || "",
      b_id: forms?.tests?.[1]?.id || "",
      c_id: forms?.tests?.[2]?.id || "",
      d_id: forms?.tests?.[3]?.id || "",
    },
  });

  const onUpdate = (values) => {
    close();
    // const multiple_question = {
    //   content: values.question,
    //   answers_attributes: [
    //     { content: values.a, correct: values.current === "a", id: values.a_id },
    //     { content: values.b, correct: values.current === "b", id: values.b_id },
    //     { content: values.c, correct: values.current === "c", id: values.c_id },
    //     { content: values.d, correct: values.current === "d", id: values.d_id },
    //   ],
    // };
    // setLoading(true);
    // putRequest(
    //   `/lessons/${lessonsId}/media_items/${mediaId}/multiple_questions/${choiceId}`,
    //   { multiple_question },
    //   user?.token
    // )
    //   .then(({ data }) => {
    //     setLoading(false);
    //     handleUpdate(true);
    //     console.log(data, "data");
    //     toast.success("Updated");
    //     form.reset();
    //     close();
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     console.log(err, "err");
    //   });
  };

  const handleDelete = () => {
    close();
    // setLoadingDelete(true);
    // deleteRequest(
    //   `/lessons/${lessonsId}/media_items/${mediaId}/multiple_questions/${choiceId}`,
    //   user?.token
    // )
    //   .then(({ data }) => {
    //     setLoadingDelete(false);
    //     toast.info("Deleted");
    //     console.log(data);
    //     handleUpdate(true);
    //     close();
    //   })
    //   .catch((err) => {
    //     setLoadingDelete(false);
    //     console.log(err);
    //     toast.info(JSON.stringify(err?.response?.data || "Error"));
    //   });
  };
  return (
    <form onSubmit={form.onSubmit(onUpdate)}>
      <details>
        <summary>
          <Flex align={"center"} justify={"space-between"} mt={"md"}>
            <p>
              {index + 1}) {forms?.question}
            </p>
            <Flex gap={"sm"}>
              <Button
                onClick={handleDelete}
                // loading={loadingDelete}
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
        <Textarea
          flex={1}
          label={"Question"}
          required
          withAsterisk
          placeholder={"Question"}
          styles={{
            input: {
              minHeight: 80,
              resize: "vertical",
            },
          }}
          {...form.getInputProps("question")}
        />
        {forms?.tests?.map((inp, index) => (
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
              checked={inp?.is_correct}
            />
            <TextInput
              flex={1}
              required
              withAsterisk
              placeholder={"Answer"}
              rightSectionWidth={120}
              defaultValue={inp.content}
              {...form.getInputProps(inputs[index]?.name)}
            />
          </Flex>
        ))}
        <Group justify="flex-end" mt="md">
          <Button
            type="submit"
            // loading={loading}
          >
            Update
          </Button>
        </Group>
      </details>
    </form>
  );
};

function MultipleChoice({ handleUpdate, close, id, defaultValues }) {
  // const [loading, setLoading] = useState(false);
  // const [mediaId, setMediaId] = useState(null);
  const [listArray, setListArray] = useState([]);

  // const user = useUser();
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
    close();
    // const multiple_question = {
    //   content: values.question,
    //   answers_attributes: [
    //     { content: values.a, correct: values.current === "a" },
    //     { content: values.b, correct: values.current === "b" },
    //     { content: values.c, correct: values.current === "c" },
    //     { content: values.d, correct: values.current === "d" },
    //   ],
    // };
    // setLoading(true);
    // postRequest(
    //   `/lessons/${id}/media_items/${mediaId}/multiple_questions`,
    //   { multiple_question },
    //   user?.token
    // )
    //   .then(({ data }) => {
    //     setLoading(false);
    //     handleUpdate(true);
    //     console.log(data, "data");
    //     toast.success("Created");
    //     form.reset();
    //     close();
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     console.log(err, "err");
    //     toast.error(err?.message);
    //   });
  };

  useEffect(() => {
    // setLoading(true);
    // getRequest(`/lessons/${id}`, user?.token)
    //   .then(({ data }) => {
    //     setMediaId(data?.media_items?.id);
    //     setLoading(false);
    setListArray(defaultValues);
    // })
    // .catch((error) => {
    //   setLoading(false);
    //   console.log(error, "error");
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    defaultValues,
    // id, user?.token
  ]);

  return (
    <Box mx="auto">
      <form hidden onSubmit={form.onSubmit(onSubmit)}>
        <Textarea
          flex={1}
          label={"Question"}
          required
          withAsterisk
          placeholder={"Question"}
          styles={{
            input: {
              minHeight: 80,
              resize: "vertical",
            },
          }}
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
          <Button
            type="submit"
            // loading={loading}
          >
            Create
          </Button>
        </Group>
      </form>
      {listArray?.map((forms, index) => (
        <FormCard
          key={forms?.id}
          forms={forms}
          // mediaId={mediaId}
          lessonsId={id}
          handleUpdate={handleUpdate}
          choiceId={forms?.id}
          close={close}
          index={index}
        />
      ))}
    </Box>
  );
}

export default MultipleChoice;
