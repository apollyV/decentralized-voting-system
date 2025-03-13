"use client";
import { Form, Input, Button, DatePicker, Textarea } from "@heroui/react";
import { now, getLocalTimeZone, parseDate } from "@internationalized/date";
import { contractAbi, contractAddress } from "@/constants";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseISO } from "date-fns";

export default function ProposalForm({
  onCreation,
}: {
  onCreation: () => void;
}) {
  const { data: hash, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const todayDate = now(getLocalTimeZone());

  const onSubmit = (e: any) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    const startDateTimestamp = parseISO(data.startDate as string).getTime();
    const endDateTimestamp = parseISO(data.endDate as string).getTime();

    try {
      writeContract(
        {
          address: contractAddress,
          abi: contractAbi,
          functionName: "createProposal",
          args: [
            data.title,
            data.description,
            BigInt(startDateTimestamp),
            BigInt(endDateTimestamp),
          ],
        },
        {
          onSuccess: handleProposalCreation,
        }
      );
    } catch (error) {
      console.error("Erreur lors de la création de la proposition :", error);
      alert("Une erreur s'est produite lors de la création de la proposition.");
    }
  };

  const handleProposalCreation = () => {
    onCreation();
  };

  return (
    <Form className="w-full flex gap-2" onSubmit={onSubmit}>
      <Input
        isRequired
        label="Title"
        labelPlacement="outside"
        name="title"
        placeholder="Enter a title"
      />
      <Textarea
        isRequired
        label="Description"
        labelPlacement="outside"
        name="description"
        placeholder="Enter a detailed description"
        minRows={3}
        maxRows={8}
      />
      <section className="w-full flex justify-between gap-2">
        <DatePicker
          isRequired
          label="Start date"
          value={todayDate}
          minValue={todayDate}
          hideTimeZone
          showMonthAndYearPickers
          labelPlacement="outside"
          name="startDate"
        />
        <DatePicker
          isRequired
          label="End date"
          defaultValue={todayDate.add({ days: 1 })}
          minValue={todayDate}
          hideTimeZone
          showMonthAndYearPickers
          labelPlacement="outside"
          name="endDate"
        />
      </section>
      <section className="w-full flex justify-end gap-2">
        <Button
          type="reset"
          variant="flat"
          color="danger"
          className="rounded-md"
        >
          Reset
        </Button>
        <Button type="submit" color="primary" className="rounded-md">
          Submit proposal
        </Button>
      </section>
    </Form>
  );
}
