import React, { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { IoArrowBackCircle } from "react-icons/io5";
import { Input } from "@material-tailwind/react";
import { FaArrowRight } from "react-icons/fa";



const MiniWallet = () => {
    const [balance, setBalance] = useState(0);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [transactions, setTransactions] = useState(
        JSON.parse(localStorage.getItem("trans")) || []
    );
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        updateAmounts();
    }, [transactions]);

    const addTransaction = (e) => {
        e.preventDefault();
        if (description.trim() === "" || amount.trim() === "") {
            alert("Please enter a description and amount.");
            return;
        }
        const newTransaction = {
            id: uniqueId(),
            description,
            amount: +amount,
        };
        setTransactions([...transactions, newTransaction]);
        setDescription("");
        setAmount("");
        updateLocalStorage([...transactions, newTransaction]);
    };

    const removeTransaction = (id) => {
        if (confirm("Are you sure you want to delete this transaction?")) {
            const updatedTransactions = transactions.filter(
                (transaction) => transaction.id !== id
            );
            setTransactions(updatedTransactions);
            updateLocalStorage(updatedTransactions);
        }
    };

    const uniqueId = () => {
        return Math.floor(Math.random() * 1000000);
    };

    const updateAmounts = () => {
        const amounts = transactions.map((transaction) => transaction.amount);
        const totalBalance = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
        setBalance(totalBalance);
        const totalIncome = amounts
            .filter((item) => item > 0)
            .reduce((acc, item) => (acc += item), 0)
            .toFixed(2);
        setIncome(totalIncome);
        const totalExpense = amounts
            .filter((item) => item < 0)
            .reduce((acc, item) => (acc += item), 0)
            .toFixed(2);
        setExpense(Math.abs(totalExpense));
    };

    const updateLocalStorage = (transactions) => {
        localStorage.setItem("trans", JSON.stringify(transactions));
    };

    const toggleDetails = () => {
        setShowDetails((prev) => !prev);
    };

    return (
        <div className="p-3 w-full flex justify-center h-full overflow-scroll">
            {!showDetails ? (
                <div className=" overflow-hidden w-full">
                    <h4 className="text-xl font-semibold">Your Balance</h4>
                    <h1 className="text-2xl mb-4">₹ {balance}</h1>
                    <div className="flex justify-between">
                        <div className="text-center">
                            <h4 className="font-semibold">INCOME</h4>
                            <p className="text-green-500">₹ {income}</p>
                        </div>
                        <div className="text-center">
                            <h4 className="font-semibold">EXPENSE</h4>
                            <p className="text-red-500">₹ -{expense}</p>
                        </div>
                    </div>
                    <form onSubmit={addTransaction} className="mt-4">
                        <div className="mb-4">
                            <label className="block mb-2 text-start text-sm font-medium text-gray-700" for="l1">Enter description</label>
                            <Input
                                label="Description"
                                type="text"
                                id="l1"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}

                                required
                            />
                        </div>
                        <div className="w-full">
                            <div className="mb-4">
                                <label className="block mb-2 text-start text-sm font-medium text-gray-700" for="l2">Add prefix(+ or -)</label>
                                <Input
                                    label="Amount"
                                    type="text"
                                    id="l2"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="₹ 0.00"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 mt-8 justify-center items-center">
                                <button
                                    type="submit"
                                    className="bg-blue-500 px-5 py-2 text-white rounded-full focus:outline-none"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={toggleDetails}
                                    className=" bg-gray-500 text-white gap-2 flex items-center rounded-full px-4 py-2 focus:outline-none"
                                >
                                    Details<FaArrowRight />
                                </button>
                            </div>
                        </div>
                    </form>

                </div>
            ) : (
                <div className=" w-full">
                    <h2 className="text-xl text-start mb-5 font-semibold">Transaction Details</h2>
                    <ul>
                        {transactions.map((transaction) => (
                            <li
                                key={transaction.id}
                                className={`mb-2 p-2 relative rounded-md flex w-full items-center border ${transaction.amount < 0 ? 'border-red-500 border-l-4' : 'border-green-500 border-l-4'}`}
                            >
                                <span className="w-full flex justify-between">
                                    <span>{transaction.description}</span>
                                    <span>₹ {transaction.amount < 0 ? '-' : '+'}{Math.abs(transaction.amount)}</span>
                                </span>

                                <button
                                    onClick={() => removeTransaction(transaction.id)}
                                    className="absolute text-xl -top-2 -right-2  text-red-500 rounded-full"
                                >
                                    <IoIosCloseCircle />
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={toggleDetails}
                        className=" absolute top-2 left-2 text-gray-600 text-3xl rounded-full focus:outline-none shadow-xl"
                    >
                        <IoArrowBackCircle />
                    </button>
                </div>
            )
            }
        </div >
    );
};

export default MiniWallet;
