
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

// eslint-disable-next-line
var Buffer = require('buffer/').Buffer // note: the trailing slash is important!
window.Buffer = Buffer;  

declare let window: any;

function createSiweMessage(address: string, statement: string, chainId?: number, expirationDuration?: number) {
  console.log(address, statement)
  const {host} = window.location;
  const {origin} = window.location;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
    const message = new SiweMessage({
        domain: host,
        address,
        statement,
        uri: origin,
        version: '1',
        ...(chainId ? {chainId} : {}),
        ...(expirationDuration ? {expirationTime: new Date(Date.now() + expirationDuration * 1000).toISOString()} : {})
        // /**ISO 8601 datetime string that, if present, indicates when the signed
        //  * authentication message is no longer valid. */
        // expirationTime?: string;
    });
    return message.prepareMessage();
}

interface SignedMessage {
  msg: string;
  sig: string;
}

export async function signInWithEthereum(chainId?: number, expirationDuration?: number): Promise<SignedMessage> {
  const {host: domain, origin} = window.location.host;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const msg = createSiweMessage(
      await signer.getAddress(),
      'Sign in with Ethereum to Cryptopasser.',
      chainId,
      expirationDuration,
  );
  let sig: string;
  try {
    sig = await signer.signMessage(msg);
  } catch (e) {
    console.log(e);
    throw e;
  }
  return { msg, sig };
}

export async function verify(signedMsgString: string): Promise<SiweMessage> {
  const signedMsg = JSON.parse(signedMsgString);
  const message = new SiweMessage(signedMsg.msg);
  const fields = await message.validate(signedMsg.sig);
  return fields;
}