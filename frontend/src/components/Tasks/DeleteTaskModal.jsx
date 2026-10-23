import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TaskService } from "@/api/tasks";

export default function DeleteTaskModal({
  open,
  onOpenChange,
  task,
  onSuccess,
}) {
  const handleDelete = async () => {
    await TaskService.remove(task.id);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task?</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500">
          Are you sure you want to delete "{task?.name}"?
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}