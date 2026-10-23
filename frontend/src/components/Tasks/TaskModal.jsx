import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TaskService } from "@/api/tasks";

export default function TaskModal({
  open,
  onOpenChange,
  task,
  onSuccess,
}) {
  const isEdit = !!task;

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (open) {
      if (task) {
        setForm({
          name: task.name,
          description: task.description,
        });
      } else {
        setForm({ name: "", description: "" });
      }
    }
  }, [open, task]);

  const handleSubmit = async () => {
    if (isEdit) {
      await TaskService.update(task.id, form);
    } else {
      await TaskService.create(form);
    }

    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Task" : "Add Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <Button onClick={handleSubmit}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}