import { CheckIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import "./sideBar.css";
import {contractAbi, contractAddress} from "@/constants";
import {useEventContext} from "@/app/EventContext";
import { useWriteContract } from "wagmi";

export default function ProposalDeletion({
  proposalId,
}: {
  proposalId: number;
}) {
  const { data: hash, writeContract } = useWriteContract();
  const { setEvent } = useEventContext();
  
  const [isConfirming, setIsConfirming] = useState(false);

  const onDelete = () => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "removeProposal",
      args: [BigInt(proposalId)],
    });
    setIsConfirming(false);
    setEvent("true");
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
