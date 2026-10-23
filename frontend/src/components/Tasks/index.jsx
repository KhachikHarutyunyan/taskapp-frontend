import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/components/context/AuthContext";

import TaskModal from "./TaskModal";
import DeleteTaskModal from "./DeleteTaskModal";

import { Button } from "@/components/ui/button";

export default function Tasks() {
  const { user } = useAuth();

  const [byOwner, setByOwner] = useState(false);

  const { data: tasks = [], refetch } = useTasks(byOwner);

  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);

  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <div className="p-6 flex flex-col gap-4">

      {/* HEADER */}
      <div className="flex justify-between">
        <Button onClick={() => {
          setSelectedTask(null);
          setOpenForm(true);
        }}>
          + Add Task
        </Button>

        <Button
          variant="outline"
          onClick={() => setByOwner((prev) => !prev)}
        >
          {byOwner ? "All Tasks" : "My Tasks"}
        </Button>
      </div>

      {/* TABLE */}
      <div className="border rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Author</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => {
              const isOwner = task.author_id === user?.id;

              return (
                <tr key={task.id} className="border-b">
                  <td className="p-2">{task.name}</td>
                  <td className="p-2">{task.description}</td>
                  <td className="p-2">
                    {task.author?.name || "-"}
                  </td>

                  <td className="p-2 text-right flex gap-2 justify-end">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task);
                        setOpenForm(true);
                      }}
                    >
                      Edit
                    </Button>

                    {/* {isOwner && ( */}
                    <Button
                      size="sm"
                      disabled={!isOwner}
                      variant="destructive"
                      onClick={() => {
                        setDeleteTask(task);
                        setOpenDelete(true);
                      }}
                    >
                      Delete
                    </Button>
                    {/* )} */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      <TaskModal
        open={openForm}
        onOpenChange={setOpenForm}
        task={selectedTask}
        onSuccess={() => {
          setSelectedTask(null);
          refetch();
        }}
      />

      {deleteTask && (
        <DeleteTaskModal
          open={openDelete}
          onOpenChange={setOpenDelete}
          task={deleteTask}
          onSuccess={() => {
            setDeleteTask(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}