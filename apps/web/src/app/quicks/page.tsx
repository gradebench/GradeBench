"use client";

import { Button } from "@gb/ui/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gb/ui/src/components/ui/card";
import { CreateTestDrawer } from "@gb-element/quicks/components/CreateTestDrawer";
import { DashboardLayout } from "@gb-element/quicks/components/DashboardLayout";
import { TestHistoryTable } from "@gb-element/quicks/components/TestHistoryTable";
import type { QuickTest } from "@gb-element/quicks/types/test";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// API Configuration
const API_BASE_URL = "http://localhost:8083/grade/v1";

// API Response Types
interface QuestionPaper {
  id: string;
  name: string;
  raw_document_url: string;
  digitized_document_url: string | null;
  processed_document_url: string | null;
  created_at: string;
  updated_at: string | null;
}

interface ApiResponse {
  success: boolean;
  status_code: number;
  status_message: string;
  data: {
    question_papers: QuestionPaper[];
  };
  error: null | string;
  metadata: {
    service: string;
    timestamp: string;
    pagination: {
      currentPage: number;
      pageSize: number;
      totalPages: number;
      totalItems: number;
    };
  };
}

// Convert API response to QuickTest format
function mapQuestionPaperToQuickTest(paper: QuestionPaper): QuickTest {
  let status: QuickTest["status"] = "draft";

  if (paper.processed_document_url) {
    status = "completed";
  } else if (paper.digitized_document_url) {
    status = "evaluating";
  } else if (paper.raw_document_url) {
    status = "uploading";
  }

  return {
    id: paper.id,
    name: paper.name,
    status,
    createdAt: paper.created_at,
    updatedAt: paper.updated_at || undefined,
  };
}

const ITEMS_PER_PAGE = 10;

export default function QuicksDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tests, setTests] = useState<QuickTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch question papers from API
  const fetchQuestionPapers = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/question-papers?page=${page}&pageSize=${ITEMS_PER_PAGE}&sortBy=created_at&sortOrder=desc`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch question papers");
      }

      const data: ApiResponse = await response.json();

      if (data.success && data.data.question_papers) {
        const mappedTests = data.data.question_papers.map(
          mapQuestionPaperToQuickTest
        );
        setTests(mappedTests);
        setTotalItems(data.metadata.pagination.totalItems);
        setTotalPages(data.metadata.pagination.totalPages);
      } else {
        setTests([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching question papers:", error);
      toast.error("Failed to load tests. Please try again.");
      setTests([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and when page changes
  useEffect(() => {
    fetchQuestionPapers(currentPage);
  }, [currentPage, fetchQuestionPapers]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle successful test creation
  const handleTestCreated = useCallback(
    async (_name: string, _rawDocumentUrl: string) => {
      // The CreateTestDrawer already created the question paper
      // Just refresh the list to show the new test
      await fetchQuestionPapers(1);
      setCurrentPage(1);
    },
    [fetchQuestionPapers]
  );

  const stats = {
    total: totalItems,
    completed: tests.filter((t) => t.status === "completed").length,
    inProgress: tests.filter((t) => t.status === "evaluating").length,
    draft: tests.filter((t) => t.status === "draft").length,
  };

  return (
    <DashboardLayout
      title=""
      action={
        <Button onClick={() => setDrawerOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create New Test
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Tests</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {stats.completed}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">
                {stats.inProgress}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Draft</CardDescription>
              <CardTitle className="text-3xl text-gray-600">
                {stats.draft}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Test History */}
        <Card>
          <CardHeader>
            <CardTitle>Test History</CardTitle>
            <CardDescription>
              View and manage all your test evaluations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <p className="text-muted-foreground">Loading tests...</p>
              </div>
            ) : (
              <TestHistoryTable
                tests={tests}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <CreateTestDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onTestCreated={handleTestCreated}
      />
    </DashboardLayout>
  );
}
