"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Label } from "@workspace/ui/components/label";
import { ArrowLeft, ArrowRight, Clock, Wallet, Timer } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { FullTask } from "@workspace/types";
import { userService } from "@/lib/apiClient";

// Timer hook for measuring task completion time
const useTimer = () => {
  const startTimeRef = useRef<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setElapsedTime(Date.now() - startTimeRef.current);
      }
    }, 100); // Update every 100ms for smooth display
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getElapsedTime = () => {
    if (startTimeRef.current) {
      return Date.now() - startTimeRef.current;
    }
    return 0;
  };

  const resetTimer = () => {
    stopTimer();
    startTimeRef.current = null;
    setElapsedTime(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  return {
    startTimer,
    stopTimer,
    getElapsedTime,
    resetTimer,
    elapsedTime,
    isRunning: intervalRef.current !== null,
  };
};

// Format milliseconds to readable time
const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  return `${remainingSeconds}s`;
};

export default function TaskAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const { publicKey } = useWallet();
  const taskId = params.id as string;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [task, setTask] = useState<FullTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  // Initialize timer
  const timer = useTimer();

  useEffect(() => {
    // Check if user is connected
    if (!publicKey) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to attempt tasks.",
      });
      router.push("/tasks");
      return;
    }

    const fetchTaskById = async () => {
      try {
        setLoading(true);
        const response = await userService.getTaskById(taskId);
        // @ts-ignore
        setTask(response.data.task);
        // @ts-ignore
        // console.log("Response ", response.data);

        // Start timer once task is loaded
        setTimeout(() => {
          timer.startTimer();
          setHasStarted(true);
          toast.info("Timer started!", {
            description: "Complete the task and submit your answer.",
          });
        }, 500);
      } catch (error) {
        console.error("Error fetching task:", error);
        toast.error("Failed to load task");
        router.push("/tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskById();
  }, [publicKey, taskId, router]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      timer.stopTimer();
    };
  }, []);

  const reward = task ? task.totalReward / task.maxParticipants : 0;

  const handleSubmit = async () => {
    if (!selectedOption) {
      toast.error("Selection required", {
        description: "Please select an option before submitting.",
      });
      return;
    }

    if (!task) {
      toast.error("Task not loaded");
      return;
    }

    // Stop timer and get elapsed time
    timer.stopTimer();
    const timeTaken = timer.getElapsedTime();

    setIsSubmitting(true);

    try {
      // Prepare submission data according to your Zod schema
      const submissionData = {
        taskId: parseInt(taskId), // Convert string to number
        optionId: selectedOption, // This is already a number
        timeTaken: timeTaken, // Time in milliseconds
      };

      // console.log("Submitting task response:", submissionData);

      // Submit to backend using your API
      await userService.submitResponse(submissionData);

      toast.success("Task completed!", {
        description: `You've earned ${reward.toFixed(3)} SOL! Time taken: ${formatTime(timeTaken)}`,
      });

      // Redirect to tasks page
      router.push("/tasks");
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error("Failed to submit task", {
        description: "Please try again or contact support.",
      });

      // Restart timer if submission failed
      timer.startTimer();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle option selection
  const handleOptionChange = (value: string) => {
    const optionId = parseInt(value);
    setSelectedOption(optionId);

    // Provide feedback when option is selected
    toast.success("Option selected!", {
      description: "You can now submit your answer.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading task...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-8">
        <p>Task not found</p>
        <Button asChild className="mt-4">
          <Link href="/tasks">Back to Tasks</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tasks">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Task Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Task Images
              {hasStarted && (
                <div className="flex items-center gap-2 text-sm font-normal">
                  <Timer className="h-4 w-4" />
                  <span className="font-mono">
                    {formatTime(timer.elapsedTime)}
                  </span>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              Examine the images carefully before making your selection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {task.options.map((option, index) => (
                <div key={option.id} className="space-y-2">
                  <h4 className="font-medium">Option {index + 1}</h4>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <Image
                      src={option.url}
                      alt={`Task option ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", option.url);
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src =
                          "/placeholder.svg?height=400&width=600&text=Image+Not+Available";
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task Details and Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>{task.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Reward:</span>
                  <span className="font-medium">{reward.toFixed(3)} SOL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Participants:
                  </span>
                  <span className="font-medium">
                    {task.filledParticipants}/{task.maxParticipants}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Select your answer:</h3>

                {hasStarted && timer.elapsedTime > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    <Timer className="h-4 w-4" />
                    <span>Time elapsed: {formatTime(timer.elapsedTime)}</span>
                  </div>
                )}

                <RadioGroup
                  value={selectedOption ? String(selectedOption) : ""}
                  onValueChange={handleOptionChange}
                >
                  <div className="grid gap-3">
                    {task.options.map((option, index) => (
                      <div
                        key={option.id}
                        className={`flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
                          selectedOption === option.id
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <RadioGroupItem
                          value={String(option.id)}
                          id={String(option.id)}
                        />
                        <Label
                          htmlFor={String(option.id)}
                          className="flex-1 cursor-pointer"
                        >
                          Option {index + 1}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/tasks">Cancel</Link>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedOption || !hasStarted}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Answer"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" className="gap-2" asChild>
          <Link href="/tasks">
            Skip to Next Task
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
