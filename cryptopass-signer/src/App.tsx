import "bootstrap/dist/css/bootstrap.min.css";
import { ethers } from "ethers";
import { QRCodeSVG } from "qrcode.react";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { signInWithEthereum } from "./eth/swie";

declare let window: any;

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = 24 * HOUR;

function App() {
    const [myAddress, setMyAddress] = useState<string>("");
    const [chainId, setChainId] = useState<number>(1);
    const [signedToken, setSignedToken] = useState<string>("");

    async function requestAccount() {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setMyAddress(address);

            const network = await provider.getNetwork();
            setChainId(network.chainId);
        } catch (e: any) {
            window.alert(e.data?.message?.toString() || e.message);
        }
    }

    async function onSignIn() {
        const msg = await signInWithEthereum();
        setSignedToken(msg);
    }

    return (
        <Container>
            <Row>
                <Col
                    xs={12}
                    md={12}
                    style={{
                        display: "flex",
                        width: "100%",
                        maxWidth: "60%",
                        margin: "0 auto",
                        justifyContent: "center",
                    }}
                    className="m-4"
                >
                    <h2>Issue ERC-4361 Authentication Token</h2>
                </Col>
                {!myAddress && (
                    <Button variant="primary" size="lg" onClick={() => requestAccount()}>
                        Connect with Wallet
                    </Button>
                )}
                {myAddress}
            </Row>
            <Row>
                {myAddress && !signedToken && (
                    <>
                        <Form>
                            <fieldset>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="expiration">Expires in</Form.Label>
                                    <Form.Select id="expiration">
                                        <option value={1 * DAY}>1 day</option>
                                        <option value={3 * DAY}>3 days</option>
                                        <option value={7 * DAY}>7 days</option>
                                        <option value={30 * DAY}>30 days</option>
                                        <option value={0}>Never</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label="Allow for all network"
                                        checked
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label="Use only once (prevent replay attack)"
                                    />
                                </Form.Group>
                            </fieldset>
                        </Form>
                        <Button type="submit" onClick={onSignIn}>
                            Submit
                        </Button>
                    </>
                )}
                {signedToken && <QRCodeSVG value={signedToken} />}
            </Row>
        </Container>
    );
}

export default App;
