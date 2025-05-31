"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ImageUpload } from "@/components/dashboard/image-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { Slider } from "@workspace/ui/components/slider";
import { Button } from "@workspace/ui/components/button";
import { TaskSubmissionSchema, TTaskSubmissionSchema } from "@workspace/types";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { adminService } from "@/lib/apiClient";

export default function CreateTaskPage() {
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TTaskSubmissionSchema>({
    // @ts-ignore
    resolver: zodResolver(TaskSubmissionSchema),
    defaultValues: {
      title: "",
      description: "",
      reward: 0.5,
      maxParticipants: 10,
      images: [],
    },
  });

  async function onSubmit(values: TTaskSubmissionSchema) {
    // console.log("Form submission started");
    if (!publicKey) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to create a task.",
      });
      return;
    }

    setIsSubmitting(true);
    // console.log("Starting submission process");

    try {
      // console.log("Creating transaction");
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(process.env.NEXT_PUBLIC_ADMIN_WALLET!),
          lamports: values.reward * LAMPORTS_PER_SOL,
        })
      );

      // console.log("Sending transaction");
      const signature = await sendTransaction(transaction, connection);
      // console.log("Transaction sent, signature:", signature);

      // console.log("Confirming transaction");
      const confirmation = await connection.confirmTransaction(
        signature,
        "confirmed"
      );

      if (confirmation.value.err) throw new Error("Transaction failed");

      // console.log("Creating task in backend");
      const res = await adminService.createTask(values, signature);

      // console.log("Task created successfully");
      toast.success("Task created successfully!", {
        description: "Your task has been published.",
      });

      router.push("/dashboard/tasks");
    } catch (error: any) {
      console.log("Error during task creation:", error);
      console.error("Error creating task:", error);
      toast.error("Error creating task", {
        description: error?.message ?? "Unknown error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Task</h1>
        <p className="text-muted-foreground">
          Create a new labeling task with image options and SOL rewards.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>
            Enter the details for your new labeling task.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                console.log("Form submit event triggered");
                form.handleSubmit(
                  (data) => {
                    // console.log("Form data:", data);
                    // console.log("Form validation state:", form.formState);
                    return onSubmit(data);
                  },
                  (errors) => {
                    console.log("Form validation errors:", errors);
                  }
                )(e);
              }}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Image Classification Task"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A clear, concise title for your task.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please classify the following images into categories..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed instructions for users completing the task.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="reward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Reward (in SOL)</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Slider
                            min={0.1}
                            max={5}
                            step={0.1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              0.1 SOL
                            </span>
                            <Input
                              type="number"
                              value={field.value}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value)
                                )
                              }
                              className="w-20"
                              step={0.1}
                              min={0.1}
                            />
                            <span className="text-sm text-muted-foreground">
                              5 SOL
                            </span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Amount of SOL to reward each user who completes the
                        task.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Participants</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Slider
                            min={1}
                            max={100}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              1
                            </span>
                            <Input
                              type="number"
                              value={field.value}
                              onChange={(e) =>
                                field.onChange(Number.parseInt(e.target.value))
                              }
                              className="w-20"
                              step={1}
                              min={1}
                            />
                            <span className="text-sm text-muted-foreground">
                              100
                            </span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Maximum number of users who can complete this task.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Options</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={(urls) => field.onChange(urls)}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload images for users to label. Minimum 2 images
                      required.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Pay & Publish"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Reward per Participant:{" "}
              {(form.watch("reward") / form.watch("maxParticipants")).toFixed(
                2
              )}{" "}
              SOL
            </p>
            <p className="text-sm text-muted-foreground">Platform Fee: 0 SOL</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
