import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Eye, Link } from "lucide-react";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    isActive: boolean;
    participants: number;
    maxParticipants: number;
    reward: number;
    createdAt: string;
    completionRate: number;
  };
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <Badge variant={task.isActive === true ? "default" : "secondary"}>
            {task.isActive === true ? "Active" : "Completed"}
          </Badge>
        </div>
        <CardDescription>Created on {task.createdAt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Participants</span>
            <span className="font-medium">
              {task.participants}/{task.maxParticipants}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Reward</span>
            <span className="font-medium">{task.reward} SOL</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completion</span>
              <span className="font-medium">{task.completionRate}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${task.completionRate}%` }}
              />
            </div>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/dashboard/tasks/${task.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
