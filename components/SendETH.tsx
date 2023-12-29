"use client"
import React, { useState } from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { useConnectedAccount } from '@/context/ConnectedAccountContext';


const SendETH = () => {
  const { connectedAccount } = useConnectedAccount()
  const [sendETH, setSendETH] = useState<number | undefined>();
  const [receiver, setReceiver] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendETH = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)

    if (window.ethereum) {
    //   const web3 = new Web3(window.ethereum);

      console.log("All set")

      try {

        if(sendETH && sendETH > 0) {

            // Convert sendETH to string and then to Wei
            // const weiValue = web3.utils.toWei(sendETH?.toString() || '0', 'ether');
            const sendETHString = sendETH?.toString() || "0";
            const weiValue = ethers.parseUnits(sendETHString, "ether")
    
            console.log("Ok ok")
    
            const txHash = await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [
                {
                  from: connectedAccount,
                  to: receiver,
                  value: '0x' + weiValue.toString(16),
                },
              ],
            });

            const txReceipt = await waitForTransactionReceipt(txHash);
    
            // alert('Sent 🎉');
            // console.log('Transaction sent:', txHash);

            if (txReceipt) {
              alert('Transaction successful 🎉');
              console.log('Transaction sent:', txHash);
            } else {
              alert('Transaction failed 😞');
            }

        }

        else {
            alert('Please enter a valid amount to send.');
        }

      } catch (error) {
        console.error(error);
        alert('Oops! Something went wrong. Please try again.');
      } finally {
        setLoading(false)
        setReceiver("")
        setSendETH(undefined)
      }

      // setLoading(false)


    } else {
      console.error('MetaMask not installed. Please install MetaMask to perform transactions.');
      setLoading(false)
      setReceiver("")
      setSendETH(undefined)
    }

  };


  // Function to wait for the transaction receipt
  const waitForTransactionReceipt = async (txHash: string) => {
    const maxRetries = 30
    const delayMs = 1000
    let retries = 0;
  
    while (retries < maxRetries) {
      try {
        const receipt = await window.ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash],
        });
  
        if (receipt && receipt.blockNumber) {
          return receipt;
        }
      } catch (error) {
        console.error('Error getting transaction receipt:', error);
      }
  
      retries++;
  
      // Wait for a specified delay before checking again
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  
    console.error('Transaction receipt not obtained after maximum retries.');
    return null; // Or handle the case where the receipt is not obtained within the specified retries
  };
  


  return (
    <>
      {
        connectedAccount ? (
          <div className='flex flex-col justify-center items-center bg-slate-600 text-slate-100 p-8 rounded-xl'>

            Your current address: {connectedAccount.slice(0,5)}...{connectedAccount.slice(-4,)}
    
            <form className='flex flex-col justify-center items-center mt-4 p-4'>
              <div className='flex flex-row justify-center items-center'>
                  <h3 className='ml-10'>To:</h3>       
                  <input
                      type='string'
                      value={receiver}
                      onChange={(e) => setReceiver(e.target.value)}
                      placeholder='e.g 0xabcd'
                      className='rounded-lg text-gray-800 ml-2 p-2'
                  />
              </div>
    
              <div className='flex flex-row justify-center items-center mt-4 p-4 mt-2'>
                  <h3>Amount:</h3>       
                  <input
                      type='number'
                      value={sendETH === undefined ? '' : sendETH}
                      onChange={(e) => setSendETH(parseFloat(e.target.value))}
                      placeholder='e.g 1 Ether'
                      className='rounded-lg text-gray-800 ml-2 p-2'
                  />
              </div>
    
              {
                !loading ? (
    
                  <button
                      className='bg-gray-300 border border-gray-400 py-2 px-4 rounded-lg text-base mt-4'
                      style={{ color: 'rgb(215, 17, 31)' }}
                      onClick={handleSendETH}
                  >
                      Send ETH
                  </button>
                ) : (
                  <div>Loading...</div>
                )
              }
            </form>
    
          </div>
        ) : (
          <h1>Please Connect you wallet</h1>
        )
      }

    </>
  );
};

export default SendETH;
