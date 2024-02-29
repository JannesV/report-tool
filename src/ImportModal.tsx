import { AttachmentIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { ReportCategoryDto } from "./types";

interface ImportModalProps {
  onSave(categories: ReportCategoryDto[]): void;
  title: string;
  buttonLabel: string;
}

export const ImportModal: FC<ImportModalProps> = ({
  onSave,
  title,
  buttonLabel,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const [text, setText] = useState("");

  const handleSave = () => {
    try {
      setErrorMessage(undefined);
      onSave(JSON.parse(text));
      onClose();
      setText("");
    } catch (err) {
      setErrorMessage((err as any).message);
    }
  };

  return (
    <>
      <Button leftIcon={<AttachmentIcon />} size="sm" mb={8} onClick={onOpen}>
        {buttonLabel}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errorMessage}>
              <Textarea
                h={400}
                value={text}
                onChange={(e) => setText(e.currentTarget.value)}
                fontFamily="monospace"
              />
              <FormErrorMessage fontFamily="monospace">
                {errorMessage}
              </FormErrorMessage>
            </FormControl>

            <Alert mt={4} status="warning">
              <AlertIcon />
              Het importeren zorgt ervoor dat alles overschreven wordt!
            </Alert>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Importeer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
