import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Comment, insertCommentSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export default function CommentSection({ postId, comments }: CommentSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertCommentSchema.omit({ postId: true })),
    defaultValues: {
      author: "",
      email: "",
      content: "",
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", `/api/posts/${postId}/comments`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Comment posted!",
        description: "Your comment has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId, "comments"] });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createCommentMutation.mutate(data);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-accent', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <Card data-testid="comments-section">
      <CardHeader>
        <CardTitle>Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Comment Form */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h4 className="text-lg font-medium text-primary mb-4">Leave a Comment</h4>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" data-testid="input-comment-author" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Your email" data-testid="input-comment-email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your comment..." 
                        rows={4}
                        data-testid="textarea-comment-content"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                disabled={createCommentMutation.isPending}
                data-testid="button-post-comment"
              >
                {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
              </Button>
            </form>
          </Form>
        </div>
        
        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-secondary">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0" data-testid={`comment-${comment.id}`}>
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 ${getAvatarColor(comment.author)} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                    {getInitials(comment.author)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-primary" data-testid={`comment-author-${comment.id}`}>
                        {comment.author}
                      </span>
                      <span className="text-sm text-secondary" data-testid={`comment-date-${comment.id}`}>
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed" data-testid={`comment-content-${comment.id}`}>
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
