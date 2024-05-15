import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Group,
  FileInput,
  Select,
  Input,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
// import { postRequest } from "../../services/api";
// import { toast } from "react-toastify";
import { useUser } from "../../redux/selectors";
import { getRequest, postRequest, putRequest } from "../../services/api";
import { toast } from "react-toastify";
import { IMAGE_URL } from "../../utils/constants";

function Media({ handleUpdate, close, id }) {
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const user = useUser();
  const form = useForm({
    initialValues: {
      media_type: "image",
      media_link: "",
    },
  });

  const onSubmit = (values) => {
    if (!values?.media_link) {
      return form.setErrors({ media_link: true });
    }
    const formData = new FormData();

    formData.append("media_item[media_type]", values?.media_type);
    formData.append("media_item[media_link]", values?.media_link);

    setLoading(true);

    if (update?.id) {
      return putRequest(
        `/lessons/${id}/media_items/${update?.id}`,
        formData,
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
          toast.success(JSON.stringify(err));
        });
    }

    postRequest(`/lessons/${id}/media_items`, formData, user?.token)
      .then(({ data }) => {
        console.log({ data });
        setLoading(false);
        toast.success("Successfully created");
        handleUpdate(true);
        close();
      })
      .catch((err) => {
        setLoading(false);
        toast.success(JSON.stringify(err));
      });
  };

  useEffect(() => {
    setLoading(true);
    getRequest("/lessons/" + id, user?.token)
      .then(({ data }) => {
        setLoading(false);
        setUpdate(data?.media_items?.id ? data?.media_items : false);
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
        <Select
          mt={"md"}
          required
          label={"Media Type"}
          placeholder={"Media Type"}
          data={[
            {
              label: "Image",
              value: "image",
            },
            {
              label: "Url",
              value: "link",
            },
          ]}
          allowDeselect={false}
          {...form.getInputProps("media_type")}
          onChange={(e) => {
            form.getInputProps("media_type").onChange(e);
            form.setValues({
              media_link: "",
            });
            form.setErrors({
              media_link: true,
            });
          }}
        />
        {form.values.media_link ? null : update?.media_link ? (
          update?.media_type === "image" ? (
            <Image
              src={IMAGE_URL + update?.media_link}
              alt="media_image"
              style={{
                width: 200,
                height: 200,
                marginTop: 50,
                objectFit: "contain",
              }}
            />
          ) : (
            <iframe
              width="100%"
              height="100%"
              src={update?.media_link}
              title={update?.media_link}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )
        ) : null}
        {form.values.media_type === "link" ? (
          <Input.Wrapper label={"Media Link"} mt={"md"} required>
            <Input
              required
              placeholder={"Media Link"}
              {...form.getInputProps("media_link")}
            />
          </Input.Wrapper>
        ) : (
          <FileInput
            mt={"md"}
            required
            label={"Media"}
            placeholder={"Media"}
            accept="image/*"
            {...form.getInputProps("media_link")}
          />
        )}
        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={loading}>
            Yuborish
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default Media;
