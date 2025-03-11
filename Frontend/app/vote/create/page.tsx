"use client"

import ProposalForm from "@/app/components/ProposalForm";
import {useEventContext} from "@/app/EventContext";

export default function Page() {
    const { setEvent } = useEventContext();
    
    const handleProposalCreation = () => {
        setEvent('Bouton cliqué !');
    };
    
    return (
        <div>
            <ProposalForm onCreation={handleProposalCreation}></ProposalForm>
        </div>
    )
}