
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

declare let window: any;

const {host: domain, origin} = window.location.host;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

function createSiweMessage(address: string, statement: string) {
    const message = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: 1,
        // /**ISO 8601 datetime string that, if present, indicates when the signed
        //  * authentication message is no longer valid. */
        // expirationTime?: string;
    });
    return message.prepareMessage();
}

export async function signInWithEthereum(): Promise<string> {
  const message = createSiweMessage(
      await signer.getAddress(),
      'Sign in with Ethereum to the app.'
  );
  let msg: string;
  try {
    msg = await signer.signMessage(message);
  } catch (e) {
    console.log(e);
    throw e;
  }
  return msg;
}
