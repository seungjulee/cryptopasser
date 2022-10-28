import { ethers } from 'ethers';

const provider = new ethers.providers.EtherscanProvider();

export interface ENSProfile {
  name: string;
  avatarUrl?: string;
  twitterHandle?: string;
}

export const EMPTY_ENS_PROFILE = {name: '', avatarUrl: '', twitterHandle: ''};

export async function getENSProfile(address: string):Promise<ENSProfile> {
  const name = await provider.lookupAddress(address)
  const networkID = await provider.getNetwork();
  console.log(name, networkID)
  if (!name) {
    return EMPTY_ENS_PROFILE;
  }
  const avatarUrl = await provider.getAvatar(name) || ''

  const ensResolver = await provider.getResolver(name)
  // You can fetch any key stored in their ENS profile.
  const twitterHandle = await ensResolver?.getText('com.twitter') || ''

  console.log(name, avatarUrl, twitterHandle)

  return {
    name,
    avatarUrl,
    twitterHandle,
  };
}