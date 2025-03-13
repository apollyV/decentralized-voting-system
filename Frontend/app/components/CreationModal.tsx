import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/react";
import ProposalForm from "./ProposalForm";
import { useEventContext } from "../EventContext";

export default function CreationModal() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { setEvent } = useEventContext();

  const onConfirm = () => {
    setEvent("Bouton cliqué !");
    onClose();
  };

  return (
    <div>
      <Button className="w-full" color="primary" onPress={onOpen}>
        Créer une proposition
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Création d'une proposition
              </ModalHeader>
              <ModalBody>
                <ProposalForm onCreation={onConfirm} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
