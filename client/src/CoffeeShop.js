// components/CoffeeShop.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { token, coffee } from "./address";
import tokenAbi from "./MyToken.json";
import coffeeShopAbi from "./coffeeShop.json";
import { Container, Row, Col, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";

import "./coffeeshop.css";
export default function CoffeeShop() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [coffeeShopContract, setCoffeeShopContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
console.log("web3 is:",web3Instance);
try {

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);

        const coffeeShop = new web3Instance.eth.Contract(coffeeShopAbi.abi, coffee);
        
        setCoffeeShopContract(coffeeShop);

        console.log("Cofee shop is:",coffeeShop);
          const tokenContract = new web3Instance.eth.Contract(tokenAbi.abi, token);
          setTokenContract(tokenContract);
          console.log('CFT token is:',tokenContract);
        } catch (error) {
          console.error("Error connecting to Web3: ", error);
        }
      } else {
        alert("Please install MetaMask to use this DApp.");
      }
    };
    initWeb3();
  }, []);

  const addCustomer = async () => {
    if (customerName.trim() === "")
         return setMessage("Please enter a name");
    setLoading(true);
    try {
      await coffeeShopContract.methods.AddCustomer(customerName).send({ from: account });
      setMessage(`Welcome, ${customerName}!`);
    } catch (error) {
      console.error("Error adding customer:", error);
      setMessage("Error adding customer. Try again.");
    }
    setLoading(false);
  };

  const buyCoffee = async () => {
    setLoading(true);
    try {
      await coffeeShopContract.methods.BuyCoffee().send({ from: account, value: web3.utils.toWei("0.01", "ether") });
      setMessage("Coffee purchased!");
    } catch (error) {
      console.error("Error buying coffee:", error);
      setMessage("Error purchasing coffee. Try again.");
    }
    setLoading(false);
  };

  const claimTokens = async () => {
    setLoading(true);
    try {
      await coffeeShopContract.methods.claimToken().send({ from: account });
      setMessage("Tokens claimed successfully!");
    } catch (error) {
      console.error("Error claiming tokens:", error);
      setMessage("Error claiming tokens. Try again.");
    }
    setLoading(false);
  };

  const transferTokensToCoffeeShop = async () => {
    if (!tokenAmount || parseFloat(tokenAmount) <= 0) {
        return setMessage("Enter a valid token amount");
    }
    if (!tokenContract || !web3 || !account || !web3.utils.isAddress(coffee)) {
        return setMessage("Ensure contracts are loaded and addresses are valid.");
    }

    setLoading(true);
    try {
        await tokenContract.methods
            .transfer(coffee, web3.utils.toWei(tokenAmount, "ether"))
            .send({ from: account });
        setMessage(`${tokenAmount} tokens transferred to the Coffee Shop!`);
    } catch (error) {
        console.error("Error transferring tokens:", error);
        setMessage("Error transferring tokens. Try again.");
    }
    setLoading(false);
};


  return (
    <Container className="shop">
      <Helmet>
        <meta name="description" content="Web3 Coffee Shop - Buy coffee and claim tokens!" />
        <title>Web3 Coffee Shop</title>
      </Helmet>

      <Row className="justify-content-center mt-4" >
    <Col md={6} className="text-center">
          <h1 className="mb-4" style={{color:"white"}}><span style={{fontSize:"70px"}}>☕</span> Web3 Coffee Shop</h1>
          <p style={{color:"white"}}>Buy coffee, earn <span style={{fontSize:"30px"}}>CFT</span> tokens,  and enjoy the Web3 experience!</p>
         <p style={{color:"white"}}><marquee>We are offering tokens!</marquee></p>
         <p style={{color:"white"}}><bold style={{color:"red"}}>Note:</bold> You can earn CFT tokens only if wi you reach the limit!..</p>
          {message && <Alert variant="info" className="mt-3">{message}</Alert>}

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" onClick={addCustomer} disabled={loading} className="mb-3 w-100">
            {loading ? <Spinner animation="border" size="sm" /> : "Register Customer"}
          </Button>

          <hr />

          <Button variant="info" onClick={buyCoffee} disabled={loading} className="mb-3 w-100">
            {loading ? <Spinner animation="border" size="sm" /> : "Buy Coffee"}
          </Button>

          <Button variant="success" onClick={claimTokens} disabled={loading} className="mb-3 w-100">
            {loading ? <Spinner animation="border" size="sm" /> : "Claim Tokens"}
          </Button>

          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              placeholder="Enter token amount to transfer"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
            />
          </Form.Group>

          <Button variant="dark" onClick={transferTokensToCoffeeShop} disabled={loading} className="w-100">
            {loading ? <Spinner animation="border" size="sm" /> : "Transfer Tokens to Coffee Shop"}
          </Button>
<br/>
<br/>
     
        </Col>
     
      </Row>
    </Container>
  );
}
