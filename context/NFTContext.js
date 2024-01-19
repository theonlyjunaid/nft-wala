import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import axios from 'axios';

import { MarketAddress, MarketAddressABI } from './constants';

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const nftCurrency = 'ETH';

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert('Make sure you have metamask!');
      console.log('Make sure you have metamask!');
      return;
    }
    console.log('We have the ethereum object', ethereum);

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert('Make sure you have metamask!');
      console.log('Make sure you have metamask!');
      return;
    }

    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(await signer.getAddress());
        const contract = new ethers.Contract(MarketAddress, MarketAddressABI, signer);
        console.log(contract);
        setCurrentAccount(await signer.getAddress());
        window.location.reload();
      } else {
        console.log('Please install Metamask');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(MarketAddress, MarketAddressABI, signer);
    const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    console.log('Price is: ', price.toString());

    const listingPrice = await contract.getListingPrice();
    console.log('Listing price is: ', listingPrice.toString());
    console.log('URL is: ', url);

    const transaction = !isReselling ? await contract.createToken(url[0], price.toString(), { value: listingPrice.toString() }) : await contract.resellToken(id, price.toString(), { value: listingPrice.toString() });
    console.log('Mining... ', transaction.hash);
    await transaction.wait();
    console.log('Transaction is: ', transaction);
  };

  const fetchNFTs = async () => {
    const url = 'https://eth-sepolia.g.alchemy.com/v2/phODLHFjD-NE7Sbr5FVltpGn90zE3DI8';
    const provider = new ethers.providers.JsonRpcProvider(url);
    const contract = new ethers.Contract(MarketAddress, MarketAddressABI, provider);
    const data = await contract.fetchMarketItems();
    console.log(data);

    try {
      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await contract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          const price = ethers.utils.formatUnits(i.price.toString(), 'ether');
          const item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          };
          return item;
        }),
      );

      console.log(items);
      return items;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMyNFTsOrCreatedNFTs = async (type) => {
    // setIsLoadingNFT(false);

    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(MarketAddress, MarketAddressABI, signer);
    const data = type === 'fetchItemsListed' ? await contract.fetchItemsListed() : await contract.fetchMyNFTs();
    console.log(data);
    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const { data: { image, name, description } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

      return { price, tokenId: tokenId.toNumber(), seller, owner, image, name, description, tokenURI };
    }));

    return items;
  };

  const buyNFT = async (nft) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(MarketAddress, MarketAddressABI, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.createMarketSale(nft.tokenId, { value: price });
    await transaction.wait();
    // window.location.reload();
  };

  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, createSale, fetchNFTs, fetchMyNFTsOrCreatedNFTs, buyNFT }}>
      {children}
    </NFTContext.Provider>
  );
};
