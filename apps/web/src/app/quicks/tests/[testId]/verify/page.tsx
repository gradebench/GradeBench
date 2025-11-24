"use client";

import { Button } from "@gb/ui/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params?.testId as string;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push(`/quicks/tests/${testId}/evaluate`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Evaluation
        </Button>
      </div>

      <div className="py-16 text-center">
        <h1 className="mb-4 font-semibold text-2xl">Verification Page</h1>
        <p className="text-muted-foreground">
          Verification functionality will be implemented here.
        </p>
      </div>
    </div>
  );
}
