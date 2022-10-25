import localforage from "localforage";
import { QRCodeSVG } from "qrcode.react";
import React, { useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { ErrorTypes, SiweMessage } from "siwe";
import { verify } from "../eth/swie";
// eslint-disable-next-line
const QrReader = require("react-qr-reader");

const STORAGE_KEY = "authtoken";

export default function DelegatedClient() {
    const [data, setData] = useState("");
    const [isImporting, setIsImporting] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [parsedMsg, setParsedMsg] = useState<SiweMessage>();

    const handleScan = async (scanData: string) => {
        console.log(`loaded data data`, scanData);
        if (scanData && scanData !== "") {
            setData(scanData);

            try {
                const parsed = await verify(scanData);
                setParsedMsg(parsed);
            } catch (e: any) {
                switch (e) {
                    case ErrorTypes.EXPIRED_MESSAGE: {
                        setErrMsg(e.message);
                        break;
                    }
                    case ErrorTypes.INVALID_SIGNATURE: {
                        setErrMsg(e.message);
                        break;
                    }
                    default: {
                        setErrMsg(e.message);
                        break;
                    }
                }
            }

            try {
                await localforage.setItem(STORAGE_KEY, scanData);
            } catch (e: any) {
                setErrMsg("failed to save the item");
            }
        }
    };
    const handleError = (err: Error) => {
        // window.alert(err);
    };

    const onImporting = () => {
        // verify(exampleSig);
        setIsImporting(true);
    };

    useEffect(() => {
        localforage
            .getItem(STORAGE_KEY)
            .then((d) => setData(d as string))
            .catch((e) => setErrMsg(e.message));
    });

    return (
        <Container>
            <Row
                style={{
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    marginTop: "1rem",
                }}
            >
                <h2>View ERC-4361 Authentication Token</h2>
            </Row>
            {!isImporting && !data && (
                <Row style={{ justifyContent: "center", display: "flex" }}>
                    <h5>There is no saved auth token. Please import it by scanning the qr code.</h5>
                    <Button variant="primary" size="lg" onClick={onImporting}>
                        Import
                    </Button>
                </Row>
            )}
            {isImporting && !data && (
                <Row style={{ justifyContent: "center", display: "flex" }}>
                    <QrReader
                        facingMode="environment"
                        delay={500}
                        onError={handleError}
                        onScan={handleScan}
                        // chooseDeviceId={() => "environment"}
                        style={{ width: "420px", height: "420px" }}
                    />
                </Row>
            )}
            {data && (
                <Row style={{ justifyContent: "center", display: "flex" }}>
                    <QRCodeSVG value={data} style={{ width: "420px", height: "420px" }} />
                </Row>
            )}
        </Container>
    );
}
