import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "@/services/products.service";
import { toast } from "sonner";
import { Star } from "lucide-react";

interface Props {
  productId: string;
  slug: string;
}

export function ReviewForm({ productId, slug }: Props) {
  const qc = useQueryClient();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const submit = useMutation({
    mutationFn: () => productsService.submitReview(productId, { rating, title, comment }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product", slug, "reviews"] });
      toast.success("Review submitted successfully");
      setIsOpen(false);
      setTitle("");
      setComment("");
      setRating(5);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 w-full rounded-md border-2 px-4 py-2 text-sm font-semibold hover:bg-muted"
      >
        Write a review
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit.mutate();
      }}
      className="mt-4 space-y-4 rounded-lg border bg-[var(--surface-2)] p-4"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-[var(--rating)] focus:outline-none"
            >
              <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-ring"
          placeholder="Summarize your experience"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Review</label>
        <textarea
          required
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-ring"
          placeholder="What did you like or dislike?"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submit.isPending}
          className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] disabled:opacity-50"
        >
          {submit.isPending ? "Submitting..." : "Submit review"}
        </button>
      </div>
    </form>
  );
}
