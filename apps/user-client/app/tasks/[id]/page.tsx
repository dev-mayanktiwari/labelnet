"use client";

import { useState } from "react";
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
import { ArrowLeft, ArrowRight, Clock, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

export default function TaskAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const { publicKey } = useWallet();
  const taskId = params.id as string;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock task data
  const task = {
    id: taskId,
    title: "Image Classification - Animals",
    description:
      "Please classify the following image into one of the categories: mammal, bird, reptile, amphibian, fish, or insect.",
    reward: 0.5,
    estimatedTime: "2-3 min",
    image: "/placeholder.svg?height=400&width=600&text=Animal Image",
    options: [
      { id: "option-1", label: "Mammal" },
      { id: "option-2", label: "Bird" },
      { id: "option-3", label: "Reptile" },
      { id: "option-4", label: "Amphibian" },
      { id: "option-5", label: "Fish" },
      { id: "option-6", label: "Insect" },
    ],
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      toast.error("Selection required", {
        description: "Please select an option before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to submit task
    setTimeout(() => {
      toast.success("Task completed!", {
        description: `You've earned ${task.reward} SOL for completing this task.`,
      });

      // Redirect to next task or tasks page
      router.push("/tasks");

      setIsSubmitting(false);
    }, 1500);
  };

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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Task Image</CardTitle>
            <CardDescription>
              Examine the image carefully before making your selection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              <Image
                src={task.image || "/placeholder.svg"}
                alt="Task image"
                fill
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>

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
                  <span className="font-medium">{task.reward} SOL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Est. Time:
                  </span>
                  <span className="font-medium">{task.estimatedTime}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Select a category:</h3>
                <RadioGroup
                  value={selectedOption || ""}
                  onValueChange={setSelectedOption}
                >
                  <div className="grid gap-2">
                    {task.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id}>{option.label}</Label>
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
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Answer"}
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
