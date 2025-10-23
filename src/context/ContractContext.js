'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

// Your verified contract address on Sepolia
const CONTRACT_ADDRESS = "0x5B9867d71e5f3AB5a55f19EF81c3a34FF946003e";

// Contract ABI based on your CertificateValidator contract
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "certificateId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "dataHash",
        "type": "bytes32"
      }
    ],
    "name": "CertificateStored",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "certificateId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      }
    ],
    "name": "CertificateVerified",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "allCertificateIds",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "certificateIds",
        "type": "string[]"
      },
      {
        "internalType": "bytes32[]",
        "name": "dataHashes",
        "type": "bytes32[]"
      }
    ],
    "name": "batchStoreCertificates",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "certificateId",
        "type": "string"
      }
    ],
    "name": "certificateExists",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "certificateId",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "dataHash",
        "type": "bytes32"
      }
    ],
    "name": "checkCertificateValidity",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalCertificates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "certificateId",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "dataHash",
        "type": "bytes32"
      }
    ],
    "name": "storeCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "transferAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const CertificateContext = createContext();

export const useCertificate = () => {
    const context = useContext(CertificateContext);
    if (!context) {
      throw new Error('useCertificate must be used within a CertificateProvider');
    }
    return context;
  };
  
  export const CertificateProvider = ({ children }) => {
    // State management
    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalCertificates, setTotalCertificates] = useState(0);
    const [networkInfo, setNetworkInfo] = useState(null);
  
    // Helper function to check network and contract
    const checkContractDeployment = useCallback(async (provider, contractAddress) => {
      try {
        const contractCode = await provider.getCode(contractAddress);
        return contractCode !== '0x';
      } catch (error) {
        console.error('Error checking contract deployment:', error);
        return false;
      }
    }, []);
  
    // Helper function to get network name
    const getNetworkName = useCallback((chainId) => {
      const networks = {
        1: 'Ethereum Mainnet',
        11155111: 'Sepolia Testnet',
        137: 'Polygon Mainnet',
        80001: 'Mumbai Testnet',
        1337: 'Localhost',
        31337: 'Hardhat Network'
      };
      return networks[chainId] || `Unknown Network (${chainId})`;
    }, []);

    // Initialize Web3 connection
    const connectWallet = useCallback(async () => {
      try {
        setLoading(true);
        setError('');
  
        if (!window.ethereum) {
          throw new Error('MetaMask not detected. Please install MetaMask.');
        }
  
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
  
        if (accounts.length === 0) {
          throw new Error('No accounts found. Please connect your wallet.');
        }
  
        // Initialize provider and signer using ethers v6 syntax
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        
        // Get network info
        const network = await web3Provider.getNetwork();
        const networkName = getNetworkName(Number(network.chainId));
        
        setNetworkInfo({
          chainId: Number(network.chainId),
          name: networkName
        });
        
        console.log(`Connected to ${networkName} (Chain ID: ${network.chainId})`);
        
        // Check if we're on Sepolia testnet
        if (Number(network.chainId) !== 11155111) {
          console.warn(`⚠️ Contract is deployed on Sepolia (Chain ID: 11155111), but you're connected to ${networkName}`);
        }
        
        // Check if contract is deployed at the specified address
        const isDeployed = await checkContractDeployment(web3Provider, CONTRACT_ADDRESS);
        
        if (!isDeployed) {
          throw new Error(
            `❌ Contract not deployed at address ${CONTRACT_ADDRESS} on ${networkName}.\n\n` +
            `Please switch to Sepolia testnet to interact with this contract.`
          );
        }
        
        // Create contract instance with signer
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Signer);

        // Test contract connection by calling view functions
        try {
          console.log('Testing contract connection...');
          
          // Get admin address and check if current user is admin
          const adminAddress = await contractInstance.admin();
          const currentAccount = accounts[0];
          const isUserAdmin = adminAddress.toLowerCase() === currentAccount.toLowerCase();
          
          // Get total certificates
          const total = await contractInstance.getTotalCertificates();
          
          console.log('✅ Contract connected successfully');
          console.log('📍 Contract address:', CONTRACT_ADDRESS);
          console.log('👤 Admin address:', adminAddress);
          console.log('🔑 Current account:', currentAccount);
          console.log('🛡️ Is admin:', isUserAdmin);
          console.log('📊 Total certificates:', Number(total));
          
          // Update state
          setProvider(web3Provider);
          setSigner(web3Signer);
          setContract(contractInstance);
          setAccount(currentAccount);
          setIsAdmin(isUserAdmin);
          setIsConnected(true);
          setTotalCertificates(Number(total));
          
        } catch (contractError) {
          console.error('Contract interaction error:', contractError);
          
          // Provide detailed error information
          if (contractError.code === 'BAD_DATA') {
            throw new Error(
              `❌ Contract ABI mismatch or network issue.\n\n` +
              `Details: ${contractError.message}\n\n` +
              `Please ensure:\n` +
              `1. You're connected to Sepolia testnet\n` +
              `2. The contract ABI matches the deployed contract`
            );
          }
          
          throw new Error(
            `Failed to interact with contract: ${contractError.message || contractError.reason}`
          );
        }
  
      } catch (err) {
        console.error('Connection error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, [checkContractDeployment, getNetworkName]);
  
    // Disconnect wallet
    const disconnectWallet = useCallback(() => {
      setIsConnected(false);
      setAccount('');
      setIsAdmin(false);
      setContract(null);
      setProvider(null);
      setSigner(null);
      setError('');
      setTotalCertificates(0);
      setNetworkInfo(null);
    }, []);
  
    const generateCertificateHash = useCallback((certificateData) => {
      // Convert certificate data to JSON string and hash it
      const dataString = JSON.stringify(certificateData, Object.keys(certificateData).sort());
      return ethers.keccak256(ethers.toUtf8Bytes(dataString));
    }, []);
  
    // Admin Functions
    const storeCertificate = useCallback(async (certificateId, certificateData) => {
      if (!contract || !isAdmin) {
        throw new Error('Not authorized or contract not initialized');
      }
  
      try {
        setLoading(true);
        setError('');
  
        const dataHash = generateCertificateHash(certificateData);
        
        console.log('Storing certificate:', { certificateId, dataHash });
        
        const tx = await contract.storeCertificate(certificateId, dataHash);
        console.log('Transaction sent:', tx.hash);
        
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt.hash);
        
        // Update total certificates count
        const total = await contract.getTotalCertificates();
        setTotalCertificates(Number(total));
  
        return { success: true, transactionHash: tx.hash };
      } catch (err) {
        console.error('Store certificate error:', err);
        const errorMessage = err.reason || err.message || 'Failed to store certificate';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    }, [contract, isAdmin, generateCertificateHash]);
  
    const batchStoreCertificates = useCallback(async (certificatesData) => {
      if (!contract || !isAdmin) {
        throw new Error('Not authorized or contract not initialized');
      }
  
      try {
        setLoading(true);
        setError('');
  
        const certificateIds = certificatesData.map(cert => cert.id);
        const dataHashes = certificatesData.map(cert => generateCertificateHash(cert.data));
  
        console.log('Batch storing certificates:', { certificateIds, dataHashes });
        
        const tx = await contract.batchStoreCertificates(certificateIds, dataHashes);
        console.log('Batch transaction sent:', tx.hash);
        
        const receipt = await tx.wait();
        console.log('Batch transaction confirmed:', receipt.hash);
  
        // Update total certificates count
        const total = await contract.getTotalCertificates();
        setTotalCertificates(Number(total));
  
        return { success: true, transactionHash: tx.hash };
      } catch (err) {
        console.error('Batch store certificates error:', err);
        const errorMessage = err.reason || err.message || 'Failed to store certificates';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    }, [contract, isAdmin, generateCertificateHash]);
  
    const transferAdmin = useCallback(async (newAdminAddress) => {
      if (!contract || !isAdmin) {
        throw new Error('Not authorized or contract not initialized');
      }
  
      try {
        setLoading(true);
        setError('');
  
        const tx = await contract.transferAdmin(newAdminAddress);
        await tx.wait();
  
        // Update admin status
        setIsAdmin(false);
  
        return { success: true, transactionHash: tx.hash };
      } catch (err) {
        console.error('Transfer admin error:', err);
        const errorMessage = err.reason || err.message || 'Failed to transfer admin rights';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    }, [contract, isAdmin]);
  
    // User Functions
    const verifyCertificate = useCallback(async (certificateId, certificateData) => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }
  
      try {
        setLoading(true);
        setError('');
  
        console.log('Verifying certificate:', certificateId);
  
        // Check if certificate exists
        const exists = await contract.certificateExists(certificateId);
        if (!exists) {
          return {
            isValid: false,
            exists: false,
            message: 'Certificate not found on blockchain'
          };
        }
  
        // Generate hash and verify
        const dataHash = generateCertificateHash(certificateData);
        const isValid = await contract.checkCertificateValidity(certificateId, dataHash);
  
        console.log('Verification result:', { exists, isValid });
  
        return {
          isValid,
          exists: true,
          message: isValid ? 'Certificate is valid and authentic' : 'Certificate data does not match blockchain record'
        };
      } catch (err) {
        console.error('Verify certificate error:', err);
        const errorMessage = err.reason || err.message || 'Failed to verify certificate';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    }, [contract, generateCertificateHash]);
  
    const checkCertificateExists = useCallback(async (certificateId) => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }
  
      try {
        setLoading(true);
        setError('');
        
        const exists = await contract.certificateExists(certificateId);
        return exists;
      } catch (err) {
        console.error('Check certificate exists error:', err);
        const errorMessage = err.reason || err.message || 'Failed to check certificate';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    }, [contract]);
  
    // Utility Functions
    const clearError = useCallback(() => {
      setError('');
    }, []);
  
    const refreshData = useCallback(async () => {
      if (!contract) return;
  
      try {
        const total = await contract.getTotalCertificates();
        setTotalCertificates(Number(total));
      } catch (err) {
        console.error('Refresh data error:', err);
      }
    }, [contract]);
  
    // Handle account changes
    useEffect(() => {
      if (window.ethereum) {
        const handleAccountsChanged = (accounts) => {
          if (accounts.length === 0) {
            disconnectWallet();
          } else {
            connectWallet();
          }
        };
  
        const handleChainChanged = () => {
          window.location.reload();
        };
  
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
  
        return () => {
          if (window.ethereum.removeListener) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
          }
        };
      }
    }, [connectWallet, disconnectWallet]);
  
    // Auto-connect if previously connected
    useEffect(() => {
      const autoConnect = async () => {
        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
              await connectWallet();
            }
          } catch (err) {
            console.error('Auto-connect error:', err);
          }
        }
      };
  
      autoConnect();
    }, [connectWallet]);
  
    const value = {
      // State
      isConnected,
      account,
      isAdmin,
      loading,
      error,
      totalCertificates,
      networkInfo,
      
      // Connection functions
      connectWallet,
      disconnectWallet,
      
      // Admin functions
      storeCertificate,
      batchStoreCertificates,
      transferAdmin,
      
      // User functions
      verifyCertificate,
      checkCertificateExists,
      
      // Utility functions
      clearError,
      refreshData,
      generateCertificateHash,
      
      // Contract info
      contractAddress: CONTRACT_ADDRESS
    };
  
    return (
      <CertificateContext.Provider value={value}>
        {children}
      </CertificateContext.Provider>
    );
  };
  
  export default CertificateProvider;
