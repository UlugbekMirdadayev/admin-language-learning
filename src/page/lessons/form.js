import { Box, Button, Group, Input, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
// import { postRequest } from "../../services/api";
// import { toast } from "react-toastify";
// import { useUser } from "../../redux/selectors";
import // postRequest,
// , putRequest
"../../services/api";
// import { toast } from "react-toastify";
// import { useState } from "react";
import Translation from "./translation";

const inputs = [
  {
    name: "title",
    label: "Title",
    as: Input,
  },
  {
    name: "objectives",
    label: "Objectivs",
    as: Textarea,
    minHeight: 200,
  },
  {
    name: "index",
    label: "Index",
    as: Input,
  },
  {
    name: "reading",
    label: "Reading",
    as: Textarea,
    minHeight: 200,
  },
];

function FormCreate({ handleUpdate, close, defaultValues }) {
  // const [loader, setLoader] = useState(false);
  // const user = useUser();
  const form = useForm({
    initialValues: {
      title: defaultValues?.title || "",
      objectives:
        defaultValues?.objectives?.map(({ name }) => name).join("") || "",
      index: defaultValues?.index || "",
    },
  });

  const onSubmit = (values) => {
    const form_data = values;
    form_data.objectives = [{ name: form_data.objectives }];
    console.log(form_data);
    // setLoader(true);
    // if (defaultValues?.id) {
    //   return null;
    // putRequest(`/lessons/${defaultValues?.id}`, values, user?.token)
    //   .then(() => {
    //     setLoader(false);
    //     toast.success("Successfully updated");
    //     handleUpdate(true);
    //     close();
    //   })
    //   .catch((err) => {
    //     setLoader(false);
    //     console.log(err, "error");
    //   });
    // } else {
    //   postRequest(`/lesson/create`, values, user?.token)
    //     .then(() => {
    //       setLoader(false);
    //       toast.success("Successfully created");
    //       handleUpdate(true);
    //       close();
    //     })
    //     .catch((err) => {
    //       setLoader(false);
    //       console.log(err, "error");
    //     });
    // }
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
            <input.as
              required
              {...form.getInputProps(input.name)}
              styles={{
                input: {
                  minHeight: input.minHeight,
                },
              }}
            />
          </Input.Wrapper>
        ))}
        <Translation />
        <Group justify="flex-end" mt="md">
          <Button
            type="submit"
            // loading={loader}
          >
            Yuborish
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default FormCreate;
