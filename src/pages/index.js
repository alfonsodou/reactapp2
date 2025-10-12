import { useState, useRef, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider"
import crowfundingManifest from "../contracts/Crowfunding.json"
import { ethers, Contract } from "ethers"

export default function Home() {
  const myContract = useRef(null);
  const [goal, setGoal] = useState("");
  const [totalContribution, setTotalContribtion] = useState(0);
  const [deadLine, setDeadLine] = useState(0);
  const [contribution, setContribution] = useState(0);

  useEffect( () => {
    let init = async () => {
      await configurarBlockchain();
      await cargarDatos();
    }
    init();
  }, [])

  const cargarDatos = async() => {
    let goalWei = await myContract.current.goal();
    let goalBNB = ethers.utils.formatEther(goalWei);
    setGoal(goalBNB);

    let totalContributionWei = await myContract.current.totalContribution();
    let totalContributionBNB = ethers.utils.formatEther(totalContributionWei);
    setTotalContribtion(totalContributionBNB);

    let deadlineSeconds = await myContract.current.deadLine();
    let deadlineDate = new Date(deadlineSeconds * 1000);
    setDeadLine(deadlineDate.toLocaleString());
  }

  const configurarBlockchain = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      await provider.request({method: "eth_requestAccounts"});
      let providerEthers = new ethers.providers.Web3Provider(provider);
      let signer = providerEthers.getSigner();
      myContract.current = new Contract(
        "0x67f14fb73805bd5cf12c0cb42113603d346f9a62",
        crowfundingManifest.abi,
        signer
      );

    } else {
      console.log("No se puede conectar con el provider")
    }
  }

  let contribute = async () => {
    const tx = await myContract.current.contribute({
      value: ethers.utils.parseEther(contribution)
    })

    await tx.wait();
    setContribution(0);

    let totalContributionWei = await myContract.current.totalContribution();
    let totalContributionBNB = ethers.utils.formatEther(totalContributionWei);
    setTotalContribtion(totalContributionBNB);    
  }

  return (
    <>
      <h1>Crowfunding</h1>
      <h2>Goal: {goal}</h2>
      <h2>Total Contribution: {totalContribution}</h2>
      <h2>Deadline: {deadLine}</h2>
      <h2>Contribution</h2>
      <input 
        type="text" 
        value={ contribution } 
        onChange={ (e) => setContribution(e.target.value) }/>
      <button onClick={ () => { contribute() }}>
        Send
      </button>
    </>
  );
}
