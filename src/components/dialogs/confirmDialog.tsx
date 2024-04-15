import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import text from "@/locales/sw.json"; // Import the JSON file

export function ConfirmDialog({
  confirmDelete,
}: {
  confirmDelete: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">{text.confirmDialog.delete}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{text.confirmDialog.pleaseConfirm}</DialogTitle>
          <DialogDescription>{text.confirmDialog.areYouSure}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {text.confirmDialog.cancel}
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button onClick={confirmDelete} variant="destructive">
              {text.confirmDialog.delete}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
