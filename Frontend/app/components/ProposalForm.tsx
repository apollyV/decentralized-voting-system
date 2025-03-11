"use client"
import { Form, Input, Button, DatePicker } from "@heroui/react";
import { now, getLocalTimeZone, parseDate } from "@internationalized/date";
import { contractAbi, contractAddress } from "@/constants";

import {
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { parseISO } from "date-fns";

export default function ProposalForm({ onCreation }) {
    const { data: hash, writeContract } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const todayDate = now(getLocalTimeZone());

    const onSubmit = (e: any) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        const startDateTimestamp = parseISO(data.startDate as string).getTime()
        const endDateTimestamp = parseISO(data.endDate as string).getTime()
        
        try {
            writeContract({
                address: contractAddress,
                abi: contractAbi,
                functionName: "createProposal",
                args: [data.title, data.description, BigInt(startDateTimestamp), BigInt(endDateTimestamp)],
            });
            onCreation('refetchProposals')
        } catch (error) {
            console.error("Erreur lors de la création de la proposition :", error);
            alert("Une erreur s'est produite lors de la création de la proposition.");
        }
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
            <Input
                isRequired
                label="Description"
                labelPlacement="outside"
                name="description"
                placeholder="Enter a description"
            />
            <div className="w-full flex justify-between gap-2">
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
            </div>
            <div className="w-full flex justify-between gap-2">
                <Button type="submit" color="primary">
                    Submit proposal
                </Button>
                <Button type="reset" variant="flat">
                    Reset
                </Button>
            </div>
        </Form>
    );
}
