import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [ticketType, setTicketType] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(new ethers.providers.Web3Provider(window.ethereum));
    }

    if (ethWallet) {
      const accounts = await ethWallet.listAccounts();
      handleAccount(accounts[0]);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.listAccounts();
    handleAccount(accounts[0]);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(ethers.utils.formatEther(balance)); // Convert balance to ether
    }
  };

  const deposit = async () => {
    if (atm && depositAmount) {
      const amountInWei = ethers.utils.parseEther(depositAmount);
      let tx = await atm.deposit({ value: amountInWei });
      await tx.wait();
      setDepositAmount(""); // Clear input field after deposit
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(ethers.utils.parseEther("1"));
      await tx.wait();
      getBalance();
    }
  };

  const bookTicket = async () => {
    if (atm && ticketType) {
      const ticketPrice = {
        platinum: "200",
        gold: "150",
        silver: "75"
      };
      let tx = await atm.bookTicket(ticketType, { value: ethers.utils.parseEther(ticketPrice[ticketType]) });
      await tx.wait();
      setTicketType(""); // Clear ticket type selection
      getBalance();
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  const initUser = () => {
    // Check if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    // Fetch balance if it's not fetched already
    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <div>
          <label>Select Ticket Type: </label>
          <select onChange={(e) => setTicketType(e.target.value)} value={ticketType}>
            <option value="">Select</option>
            <option value="platinum">Platinum</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
          </select>
          {ticketType && (
            <button onClick={bookTicket}>Book {ticketType.charAt(0).toUpperCase() + ticketType.slice(1)} Ticket</button>
          )}
        </div>
        <div>
          <label>Deposit Amount (ETH): </label>
          <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
          <button onClick={deposit}>Deposit</button>
        </div>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
      </div>
    );
  };

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
