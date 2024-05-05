import React from "react";
import { Button, Modal, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const ModalScreen = ({
  btn_title,
  title,
  body,
  color,
  onClose,
  disabledBtn = false,
  defaultOpened,
  popupBtn = "Click to open",
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal
        opened={defaultOpened || opened}
        onClose={() => {
          close();
          typeof onClose === "function" && onClose();
        }}
        title={title}
      >
        {body({ close, open })}
      </Modal>
      <Tooltip label={popupBtn}>
        <Button bg={color} onClick={open} disabled={disabledBtn}>
          {btn_title}
        </Button>
      </Tooltip>
    </>
  );
};

export default ModalScreen;
