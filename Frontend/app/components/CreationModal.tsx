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
      <Button className="w-full rounded-md" color="primary" onPress={onOpen}>
        Create a proposal
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        className="rounded-md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Proposal creation
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
