"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteUser } from "../../_actions/users";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteDropDownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      className="flex items-center gap-2 cursor-pointer"
      onClick={() =>
        startTransition(async () => {
          const confirmed = confirm("Are you sure you want to delete this user? This action cannot be undone.");
          if (!confirmed) return;

          await deleteUser(id);
          router.refresh();
        })
      }
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          Delete
        </>
      )}
    </DropdownMenuItem>
  );
}
