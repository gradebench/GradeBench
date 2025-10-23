"use client";

import { Button } from "@gb/ui/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@gb/ui/components/ui/drawer";
import { Label } from "@gb/ui/components/ui/label";
import { UploadIcon, XIcon } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";

interface CreateTestDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateTestDrawer({
	open,
	onOpenChange,
}: CreateTestDrawerProps) {
	const fileUploadId = useId();
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setUploadedFiles(Array.from(e.target.files));
		}
	};

	const removeFile = (index: number) => {
		setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
	};

	const handleSubmit = () => {
		console.log({ uploadedFiles });
		toast.success("Test question paper uploaded successfully");
		onOpenChange(false);
		setUploadedFiles([]);
		// Redirect to test creation page
		const newTestId = `test-${Date.now()}`;
		window.location.href = `/quicks/tests/${newTestId}`;
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Upload Question Paper</DrawerTitle>
					<DrawerDescription>
						Upload your test question papers to create a new test
					</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-y-auto p-6">
					<div className="mx-auto max-w-2xl space-y-4">
						<div>
							<Label className="text-base">Upload Question Papers</Label>
							<div className="mt-3 flex items-center justify-center rounded-lg border-2 border-dashed p-12">
								<label
									htmlFor={fileUploadId}
									className="flex cursor-pointer flex-col items-center"
								>
									<UploadIcon className="mb-3 h-12 w-12 text-muted-foreground" />
									<span className="mb-1 font-medium text-sm">
										Click to upload or drag and drop
									</span>
									<span className="text-muted-foreground text-xs">
										PDF, PNG, JPG (max 10MB)
									</span>
									<input
										id={fileUploadId}
										type="file"
										multiple
										accept=".pdf,.png,.jpg,.jpeg"
										className="hidden"
										onChange={handleFileUpload}
									/>
								</label>
							</div>
						</div>

						{uploadedFiles.length > 0 && (
							<div className="space-y-3">
								<Label className="text-base">
									Uploaded Files ({uploadedFiles.length})
								</Label>
								<div className="space-y-2">
									{uploadedFiles.map((file, index) => (
										<div
											key={index}
											className="flex items-center justify-between rounded-lg border bg-muted/50 p-3"
										>
											<span className="text-sm">{file.name}</span>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => removeFile(index)}
											>
												<XIcon className="h-4 w-4" />
											</Button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<DrawerFooter>
					<div className="flex gap-2">
						<DrawerClose asChild>
							<Button variant="outline" className="flex-1">
								Cancel
							</Button>
						</DrawerClose>
						<Button
							onClick={handleSubmit}
							className="flex-1"
							disabled={uploadedFiles.length === 0}
						>
							Upload & Create Test
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
