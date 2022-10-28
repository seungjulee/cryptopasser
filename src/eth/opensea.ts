import axios from 'axios';

export function makeOpenSeaURL(address: string) {
  return `https://api.opensea.io/api/v1/assets?owner=${address}`
}

export const fetchUserFromOpenSea = (address: string) => {
  return () => axios.get(`https://api.opensea.io/api/v1/assets?owner=${address}`);
};

export const fetchNFTAssetFromOpenSea = (address: string) => {
  return () => axios.get(`https://api.opensea.io/api/v1/asset/${address}/1`);
};

export async function checkNFTsOfUser(userAddress: string, contractAddress: string): Promise<NFTUserMetadata | null> {
  try {
      const res = await fetch(makeOpenSeaURL(userAddress));
      if (!res.ok) {
          throw new Error(res.statusText)
      }

      const body = await res.json();

      if (!body.assets || !Array.isArray(body.assets) || body.assets.length === 0) {
          return null
      }

      return normalizeOpenSeaUserData(body, contractAddress);
  } catch (err: any) {
      console.error(`Failed to resolve nfts: ${err.message}`);
      throw err;
  }
}

export interface NFTContractMetadata {
  name: string;
  imageURL: string;
  description: string;
  symbol: string
}

export const EMPTY_NFT_CONTRACT_METADATA = {name: '', imageURL: '', description: '', symbol: ''};

export function normalizeOpenSeaContractData(data: any): NFTContractMetadata {
  if (!data.data || !data.data.asset_contract) {
      return EMPTY_NFT_CONTRACT_METADATA; 
  }

  const { name, symbol, description, image_url: imageURL } = data.data.asset_contract;

  return {
    name,
    symbol,
    description,
    imageURL,
  }
}

export interface NFTUserMetadata {
  name: string;
  imageURL: string;
  description: string;
  symbol: string
  tokenID: string;
  openseaLink: string;
}

export function normalizeOpenSeaUserData(data: any, contractAddress: string): NFTUserMetadata | null {
  let symbol = '';
  const filteredArr = data.assets.filter((asset: any) => {
    if (asset.asset_contract.address === contractAddress) {
      symbol = asset.asset_contract.symbol;
      return true;
    }
    return false;
  })

  if (filteredArr.length !== 1) return null;

  const { name, description, image_url: imageURL, token_id: tokenID, permalink: openseaLink } = filteredArr[0];

  return {
    name,
    description,
    imageURL,
    tokenID,
    symbol,
    openseaLink,
  };
}
