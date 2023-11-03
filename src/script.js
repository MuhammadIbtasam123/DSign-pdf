 // function to enerate digital signature using cryptographic technique
    // adding forge library
    import forge from "https://cdnjs.cloudflare.com/ajax/libs/forge/0.10.0/forge.min.js";
    
    // function to generate PKCS7
    export default function generatePKCS7({fileContents}) 
    {
        const certificatePromise = fetch(
            "../pdfviewer/cert.pem"
        ).then((response) => response.text());

        const privateKeyPromise = fetch(
            "../pdfviewer/private-key.pem"
        ).then((response) => response.text());

        return new Promise((resolve, reject) => {
            Promise.all([certificatePromise, privateKeyPromise])
                .then(([certificatePem, privateKeyPem]) => {
                    const certificate = forge.pki.certificateFromPem(
                        certificatePem
                    );
                    const privateKey = forge.pki.privateKeyFromPem(
                        privateKeyPem
                    );

                    const p7 = forge.pkcs7.createSignedData();
                    p7.content = forge.util.createBuffer(fileContents);
                    p7.addCertificate(certificate);
                    p7.addSigner({
                        key: privateKey,
                        certificate,
                        digestAlgorithm: forge.pki.oids.sha256,
                        authenticatedAttributes: [
                            {
                                type: forge.pki.oids.contentType,
                                value: forge.pki.oids.data,
                            },
                            {
                                type: forge.pki.oids.messageDigest,
                            },
                            {
                                type: forge.pki.oids.signingTime,
                                value: new Date(),
                            },
                        ],
                    });
                    p7.sign({ detached: true });
                    const result = stringToArrayBuffer(
                        forge.asn1.toDer(p7.toAsn1()).getBytes()
                    );
                    resolve(result);
                })
                .catch((reject));
        });
    };

    function stringToArrayBuffer(binaryString){
        const buffer = new ArrayBuffer(binaryString.length);
        const bufferview = new Uint8Array(buffer);
        for (let i = 0; i < binaryString.length; i++) {
            bufferview[i] = binaryString.charCodeAt(i);
        }
        return buffer;
    }

