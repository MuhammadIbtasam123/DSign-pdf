// pages/index.js
import { useEffect, useRef } from 'react';
import generatePKCS7  from './script.js';

export default function PdfViewerComponent(props) {
	const containerRef = useRef(null);

	useEffect(() => {
		const container = containerRef.current;
		let PSPDFKit;
		(async function () {
			PSPDFKit = await import('pspdfkit');
			PSPDFKit.unload(container); // Ensure that there's only one PSPDFKit instance.

			const instance = await PSPDFKit.load({
				container,
				document: props.document,
				baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
			}).then((instance) => {
				console.log('Successfully logged the instance', instance)
				instance.signDocument(null,generatePKCS7)
				.then(()=>{
					console.log("Document signed successfully!.");
				})
				.catch((error)=>{
					console.log("Error while signing the document",error);
				});
			}).catch(error => {
				console.error(error.message, error.stack)
			});
		})();

		// Clean up on unmount.
		return () => PSPDFKit && PSPDFKit.unload(container);

		// Only re-run the effect if props.document changes.
	}, [props.document]);


	return (
		<div
			ref={containerRef}
			style={{ width: '100%', height: '100vh' }}
		></div>
		 
	);
}