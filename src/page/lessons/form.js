import { Box, Button, Group, Input } from "@mantine/core";
import { useForm } from "@mantine/form";
// import { postRequest } from "../../services/api";
// import { toast } from "react-toastify";
import { useUser } from "../../redux/selectors";
import { putRequest } from "../../services/api";
import { toast } from "react-toastify";
import { useState } from "react";

const inputs = [
  {
    name: "title",
    label: "Title",
    as: Input,
  },
  {
    name: "description",
    label: "Description",
    as: Input,
  },
  {
    name: "index",
    label: "Index",
    as: Input,
  },
];

function FormCreate({ handleUpdate, close, defaultValues }) {
  const [loader, setLoader] = useState(false);
  const user = useUser();
  const form = useForm({
    initialValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      index: defaultValues?.index || "",
    },
  });

  const onSubmit = (values) => {
    setLoader(true);
    putRequest(`/lessons/${defaultValues.id}`, values, user?.token)
      .then(() => {
        setLoader(false);
        toast.success("Successfully updated");
        handleUpdate(true);
        close();
      })
      .catch((err) => {
        setLoader(false);
        console.log(err, "error");
      });
  };

  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit(onSubmit)}>
        {inputs.map((input) => (
          <Input.Wrapper
            key={input.name}
            mt={"md"}
            label={input.label}
            placeholder={input.label}
            disabled={input.disabled}
          >
            <Input required {...form.getInputProps(input.name)} />
          </Input.Wrapper>
        ))}
        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={loader}>
            Yuborish
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default FormCreate;
