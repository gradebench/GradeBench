"use client";

import { useState } from "react";

const Page = () => {
	return <UploadQuestion />;
};

const UploadQuestion = () => {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) setFile(e.target.files[0]);
	};

	const handleUpload = async () => {
		if (!file) return alert("No file selected");
		setUploading(true);

		// Step 1: Ask backend for presigned URL
		const res = await fetch(
			"http://localhost:8083/grade/v1/question-paper/upload",
		);
		const { uploadUrl, fileUrl } = await res.json();

		console.log(uploadUrl, fileUrl);

		// Step 2: Upload file directly to S3
		const s3Res = await fetch(uploadUrl, {
			method: "PUT",
			headers: { "Content-Type": file.type },
			body: file,
		});

		if (!s3Res.ok) throw new Error("S3 upload failed");

		// Step 3: Save file URL in your DB (optional)
		// await fetch('/api/save-file', { method: 'POST', body: JSON.stringify({ url: fileUrl }) })

		setUploadedUrl(fileUrl);
		setUploading(false);
	};

	return (
		<div className="space-y-4 p-6">
			<input type="file" onChange={handleFileChange} />
			<button
				type="button"
				disabled={uploading}
				onClick={handleUpload}
				className="rounded bg-blue-600 px-4 py-2 text-white"
			>
				{uploading ? "Uploading..." : "Upload"}
			</button>

			{uploadedUrl && (
				<p>
					✅ Uploaded:{" "}
					<a
						href={uploadedUrl}
						target="_blank"
						className="text-blue-500 underline"
					>
						{uploadedUrl}
					</a>
				</p>
			)}
		</div>
	);
};

export default Page;
