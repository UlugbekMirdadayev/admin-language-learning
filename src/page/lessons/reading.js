import { useState, useEffect } from "react";
import { Box, Button, Group, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
// import { postRequest } from "../../services/api";
// import { toast } from "react-toastify";
import { useUser } from "../../redux/selectors";
import { getRequest, postRequest, putRequest } from "../../services/api";
import { toast } from "react-toastify";

const inputs = [
  {
    name: "text",
    label: "Content",
    as: Textarea,
  },
];

function Reading({ handleUpdate, close, id }) {
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const user = useUser();
  const form = useForm({
    initialValues: {
      text: "",
    },
  });

  const onSubmit = (values) => {
    setLoading(true);
    if (update) {
      return putRequest(
        `/lessons/${id}/text_question_sets/${update}`,
        {
          lesson_id: id,
          text: values?.text,
        },
        user?.token
      )
        .then(() => {
          setLoading(false);
          toast.success("Successfully updated");
          handleUpdate(true);
          close();
        })
        .catch((err) => {
          setLoading(false);
          toast.error(JSON.stringify(err));
        });
    }
    postRequest(
      `/lessons/${id}/text_question_sets`,
      {
        lesson_id: id,
        text: values?.text,
      },
      user?.token
    )
      .then(() => {
        setLoading(false);
        toast.success("Successfully created");
        handleUpdate(true);
        close();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(JSON.stringify(err));
      });
  };

  useEffect(() => {
    setLoading(true);
    getRequest(`/lessons/${id}`, user?.token)
      .then(({ data }) => {
        setLoading(false);
        form.setValues({
          text: data?.text_question_sets?.text,
        });
        setUpdate(
          data?.text_question_sets?.text ? data?.text_question_sets?.id : false
        );
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
        {inputs.map((input) => (
          <input.as
            key={input.name}
            mt={"md"}
            required
            withAsterisk
            label={input.label}
            placeholder={input.label}
            disabled={input.disabled}
            {...form.getInputProps(input.name)}
            styles={{
              input: {
                minHeight: 200,
              },
            }}
          />
        ))}
        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={loading}>
            Yuborish
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default Reading;
