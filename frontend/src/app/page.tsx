'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Activity, CreditCard, DollarSign } from "lucide-react";
import React, { useEffect, useState } from "react";
import Contract from "./ExpenseSplitter.json";

import { ethers, JsonRpcProvider } from "ethers";

const localProvider = new JsonRpcProvider(
  "http://localhost:8545"
);

export const getContract = async (address, abi, signerIndex) => {
  const signer = await localProvider.getSigner(signerIndex);
  const contract = new ethers.Contract(address, abi, signer);
  return contract;
};

type StatProp = {
  title: string,
  icon: React.ReactNode,
  value: string
}
function Stat({ title, icon, value }: StatProp) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="uppercase text-sm flex justify-between items-center p-2">
          {title}
          <span className="pl-4">
            {icon}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex text-center justify-center">
        <div>{value}</div>
      </CardContent>
    </Card>
  )
}

function StatSection({ cashFlow, totalExpenses, activeExpenses }) {
  return (
    <section id="stats" className="flex justify-center flex-wrap space-x-8 p-8">
      <Stat title="cash flow" icon={<DollarSign size={16} />} value={cashFlow} />
      <Stat title="total expenses" icon={<CreditCard size={16} />} value={totalExpenses} />
      <Stat title="active expenses" icon={<Activity size={16} />} value={activeExpenses} />
    </section>
  )
}

export default function Home() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [cashFlow, setCashFlow] = useState(0);
  const [activeExpenses, setActiveExpenses] = useState(0);
  const [expenseContract, setContract] = useState(null);

  useEffect(() => {
    async function initContract() {
      const contract = await getContract(
        "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        Contract.abi,
        0 // Use the first account as the signer
      );
      setContract(contract);
      const count = await contract.getExpensesLength();
      const cashFlow = await contract.cashFlow();
      const activeExpenses = await contract.activeExpenses();
      setTotalExpenses(Number.parseInt(count));
      setCashFlow(Number.parseInt(cashFlow));
      setActiveExpenses(Number.parseInt(activeExpenses));
    }
    initContract();
  }, []);

  if (expenseContract === null) {
    return (<h1>Loading...</h1>)
  }

  return (
    <div className="flex flex-col p-8 text-center bg-slate-200 min-h-screen w-[70%] mx-auto my-8 rounded-xl">
      <section id="hero">
        <h1 className="text-4xl tracking-wider">CryptoShare</h1>
      </section>
      <StatSection totalExpenses={totalExpenses} activeExpenses={activeExpenses} cashFlow={cashFlow} />
      <hr className="w-[80%] bg-slate-400 h-[2px] mx-auto my-4" />
      <section id="activity">
        <h1 className="text-2xl tracking-wider">Activity</h1>
      </section>
    </div>
  )
}