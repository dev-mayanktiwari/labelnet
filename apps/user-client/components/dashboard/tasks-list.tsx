"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Eye } from "lucide-react";
import Link from "next/link";

export function TaskList() {
  // Mock data for tasks
  const tasks = [
    {
      id: "task-1",
      title: "Image Classification - Animals",
      status: "active",
      participants: 24,
      maxParticipants: 50,
      reward: 0.5,
      createdAt: "2025-05-01",
    },
    {
      id: "task-2",
      title: "Object Detection - Vehicles",
      status: "active",
      participants: 18,
      maxParticipants: 30,
      reward: 0.8,
      createdAt: "2025-05-03",
    },
    {
      id: "task-3",
      title: "Sentiment Analysis - Text",
      status: "completed",
      participants: 30,
      maxParticipants: 30,
      reward: 0.3,
      createdAt: "2025-04-28",
    },
    {
      id: "task-4",
      title: "Facial Recognition - Emotions",
      status: "active",
      participants: 12,
      maxParticipants: 40,
      reward: 0.6,
      createdAt: "2025-05-05",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Task
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Participants
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Reward
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Created
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 align-middle">{task.title}</td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={
                        task.status === "active" ? "default" : "secondary"
                      }
                    >
                      {task.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    {task.participants}/{task.maxParticipants}
                  </td>
                  <td className="p-4 align-middle">{task.reward} SOL</td>
                  <td className="p-4 align-middle">{task.createdAt}</td>
                  <td className="p-4 align-middle">
                    <Link href={`/dashboard/tasks/${task.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
