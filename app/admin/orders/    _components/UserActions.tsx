"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteOrder } from "../../_actions/orders";

export function DeleteDropDownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      className="text-accentRed hover:bg-accentRed/10 focus:bg-accentRed/10 cursor-pointer flex items-center gap-2"
      onClick={() =>
        startTransition(async () => {
          const confirmed = confirm("Are you sure you want to delete this order?");
          if (!confirmed) return;

          await deleteOrder(id);
          router.refresh();
        })
      }
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin h-4 w-4" />
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
