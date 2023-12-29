'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useConnectedAccount } from '@/context/ConnectedAccountContext';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { connectedAccount, setConnectedAccount } = useConnectedAccount()
  
  // const [connectedAccount, setConnectedAccount] = useState('');

  useEffect(() => {

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setIsWalletConnected(true)
        setConnectedAccount(accounts[0])
      }

      else {
        setIsWalletConnected(false)
        setConnectedAccount("")
      }
    }

    if (window.ethereum) {
      // Check if MetaMask is installed
      window.ethereum.autoRefreshOnNetworkChange = false
      
      // Check if the user is already connected
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if(accounts.length > 0) {
            setIsWalletConnected(true)
            setConnectedAccount(accounts[0]); // Set the first connected account
          }
        })
        .catch((error: Error) => {
          console.log(error)
        })

        // Listen for changes in connected accounts
        window.ethereum.on("accountsChanged", handleAccountsChanged)
    }

    return () => {
      if(window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }

    

  }, [])

  const handleClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setConnectedAccount('');
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        console.log("Connecting...")

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'})

        if (accounts.length > 0) {
          setIsWalletConnected(true) 
          setConnectedAccount(accounts[0]); // Set the first connected account
        }
      }

      else {
        alert("MetaMask not installed. Please install MetaMask to connect your wallet.");
      }
      
    } catch (error) {
      console.error(error);
      alert("Error Connecting Wallet🥲")
    }

    
  }


  return (
    <div className="p-8 md:p-16 md:py-8 relative flex justify-between items-center bg-cover shadow md:shadow-lg h-20">
      <Link href="/" className="flex flex-row items-center">
        <h1 style={{ color: 'rgb(215, 17, 31)' }}>WEB3.0 SPACE</h1>
      </Link>

      <div>
        {isWalletConnected ? (
          <>
            <div className="hidden sm:flex flex-row gap-12 sm:gap-8 sm:mr-8 sm:ml-2 md:mr-0 md:ml-0">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/movie">Movie</Link>
              <Link href="/contact">Contact</Link>
            </div>

            <div className="sm:hidden">
              <div onClick={handleClick} className="cursor-pointer">
                {menuOpen ? (
                  <span className="material-symbols-outlined">close</span>
                ) : (
                  <span className="material-symbols-outlined">menu</span>
                )}
              </div>

              {menuOpen && (
                <div className="w-[280px] text-white min-h-screen absolute top-0 right-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm">
                  <span
                    className="material-symbols-outlined absolute top-7 right-8 py-1 cursor-pointer"
                    onClick={handleClick}
                  >
                    close
                  </span>

                  <div className="flex flex-col p-2 justify-center text-lg items-center mt-20 gap-y-4">
                    <button className='bg-gray-300 border border-gray-400 py-2 px-4 rounded-lg text-base'
                      style={{ color: 'rgb(215, 17, 31)' }}
                      onClick={disconnectWallet}
                    >
                      Connected to: {connectedAccount.slice(0,5)}...{connectedAccount.slice(-4)}
                    </button>
                    <Link href="/">Home</Link>
                    <Link href="/about">About</Link>
                    <Link href="/movie">Movie</Link>
                    <Link href="/contact">Contact</Link>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            className="bg-gray-300 border border-gray-400 py-2 px-4 rounded-lg"
            style={{ color: 'rgb(215, 17, 31)' }}
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>


      {isWalletConnected && !menuOpen &&(
        <button className='bg-gray-300 border border-gray-400 py-2 px-4 rounded-lg hidden sm:flex'
        style={{ color: 'rgb(215, 17, 31)' }}
        onClick={disconnectWallet}
        >
          Connected to: {connectedAccount.slice(0,5)}...{connectedAccount.slice(-4)}
        </button>)
      }

    </div>
  );
};

export default Header;
