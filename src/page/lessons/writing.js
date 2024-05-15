import { useState, useEffect } from "react";
import { Box, Button, Flex, Group, Textarea } from "@mantine/core";
import { toast } from "react-toastify";
import { useForm } from "@mantine/form";
import { useUser } from "../../redux/selectors";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../services/api";
import { PlusIcon, SendIcon, Trash } from "../../components/icon";

function Writing({ handleUpdate, close, id }) {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [textQuestionId, setTextQuestionId] = useState(null);
  const [questions, setQuestions] = useState([
    { text: "" },
    { text: "" },
    { text: "" },
    { text: "" },
    { text: "" },
  ]);

  const user = useUser();
  const form = useForm({
    initialValues: {
      text1: "",
      text2: "",
      text3: "",
      text4: "",
      text5: "",
    },
  });

  const onSubmit = (text) => {
    console.log(text);
  };

  const sendCheck = (text, input_id) => {
    if (!text) return;

    setLoading(true);
    if (input_id) {
      return putRequest(
        `/questions/${input_id}`,
        {
          question: {
            text_question_set_id: textQuestionId,
            text: text,
          },
        },
        user?.token
      )
        .then(() => {
          setLoading(false);
          toast.success("Successfully updated");
          handleUpdate(true);
        })
        .catch((err) => {
          setLoading(false);
          toast.error(JSON.stringify(err));
        });
    } else {
      postRequest(
        `/questions`,
        {
          question: {
            text_question_set_id: textQuestionId,
            text: text,
          },
        },
        user?.token
      )
        .then(() => {
          setLoading(false);
          toast.success("Successfully created");
          handleUpdate(true);
        })
        .catch((err) => {
          setLoading(false);
          toast.error(JSON.stringify(err));
        });
    }
  };

  const handleDelete = (input_id, index) => {
    if (!input_id && (index === 0 ? true : index))
      return setQuestions(questions.filter((_, _index) => _index !== index));

    setIsLoading(input_id);
    deleteRequest(`/questions/${input_id}`, user?.token)
      .then(() => {
        setIsLoading(false);
        toast.success("Successfully deleted");
        handleUpdate(true);
        setQuestions(questions.filter((item) => item?.id !== input_id));
        form.setValues({
          [`text${index}`]: "",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(JSON.stringify(err));
      });
  };

  useEffect(() => {
    setLoading(true);
    getRequest(`/lessons/${id}`, user?.token)
      .then(({ data }) => {
        setLoading(false);
        data?.text_question_sets?.questions?.map(({ text }, index) =>
          form.setValues({
            [`text${index}`]: text,
          })
        );
        setTextQuestionId(data?.text_question_sets?.id);
        setQuestions(
          data?.text_question_sets?.questions?.length
            ? data?.text_question_sets?.questions
            : questions
        );
        // form.setValues({
        //   text: data?.text_question_sets?.text,
        // });
        // setUpdate(
        //   data?.text_question_sets?.text ? data?.text_question_sets?.id : false
        // );
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
        {questions.map((input, index) => (
          <Textarea
            key={index}
            mt={"md"}
            required
            withAsterisk
            styles={{
              input: {
                minHeight: 140,
                resize: "vertical",
              },
            }}
            label={`${index + 1}) Question`}
            placeholder={"Question"}
            rightSectionWidth={120}
            rightSectionProps={{
              style: {
                alignItems: "flex-end",
                margin: 10,
              },
            }}
            rightSection={
              <Flex align={"flex-end"}>
                <Button
                  loading={isLoading === input?.id}
                  w={60}
                  color="red"
                  disabled={questions?.length === 1}
                  onClick={() => handleDelete(input?.id, index)}
                >
                  <Trash fill="#fff" />
                </Button>
                <Button
                  w={60}
                  onClick={() =>
                    sendCheck(form?.values[`text${index}`], input?.id)
                  }
                  disabled={!form?.values[`text${index}`]}
                >
                  <SendIcon fill="#fff" />
                </Button>
              </Flex>
            }
            {...form.getInputProps(`text${index}`)}
          />
        ))}
        <Button
          onClick={() => setQuestions([...questions, { text: "" }])}
          mt={"md"}
        >
          <PlusIcon fill="#fff" />
        </Button>
        <Group justify="flex-end" mt="md">
          <Button onClick={close} type="button" loading={loading}>
            Close
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default Writing;
