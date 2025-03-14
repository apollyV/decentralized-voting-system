import { CheckIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import "./sideBar.css";

export default function ProposalDeletion({
  proposalId,
}: {
  proposalId: number;
}) {
  const [isConfirming, setIsConfirming] = useState(false);

  const onDelete = () => {
    console.log(proposalId);
    setIsConfirming(false);
  };

  return (
    <section
      onBlur={() => setIsConfirming(false)}
      className="listItemSideBar__trash"
    >
      {isConfirming ? (
        <div className="flex place-items-center gap-2">
          <p className="opacity-50 text-xs">Confirm ?</p>
          <XMarkIcon
            className="size-3 text-danger-500"
            onClick={() => setIsConfirming(false)}
          />
          <CheckIcon className="size-3 text-success-500" onClick={onDelete} />
        </div>
      ) : (
        <TrashIcon
          onClick={() => setIsConfirming(true)}
          className="size-4 text-danger-500"
        />
      )}
    </section>
  );
}
