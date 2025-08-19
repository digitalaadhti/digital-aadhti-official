import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { type Post, insertPostSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = ["Technology", "Business", "Analytics", "Market Insights", "Commission Management", "Grain Trading", "Agriculture"];

export default function Editor() {
  const { id } = useParams<{ id?: string }>();
  const [location, navigate] = useLocation();
  const [content, setContent] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing post if editing
  const { data: existingPost, isLoading } = useQuery<Post>({
    queryKey: ["/api/posts", id],
    enabled: !!id,
  });

  const form = useForm({
    resolver: zodResolver(insertPostSchema.extend({
      excerpt: insertPostSchema.shape.excerpt.optional(),
    })),
    defaultValues: {
      title: "",
      subtitle: "",
      content: "",
      excerpt: "",
      category: "Technology",
      featuredImage: "",
    },
  });

  // Update form when editing existing post
  useEffect(() => {
    if (existingPost) {
      form.reset({
        title: existingPost.title,
        subtitle: existingPost.subtitle || "",
        content: existingPost.content,
        excerpt: existingPost.excerpt,
        category: existingPost.category,
        featuredImage: existingPost.featuredImage || "",
      });
      setContent(existingPost.content);
    }
  }, [existingPost, form]);

  // Watch content field for live preview
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.content) {
        setContent(value.content);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const createPostMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/posts", data);
      return response.json();
    },
    onSuccess: (post) => {
      toast({
        title: "Post published!",
        description: "Your post has been successfully published.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      navigate(`/post/${post.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", `/api/posts/${id}`, data);
      return response.json();
    },
    onSuccess: (post) => {
      toast({
        title: "Post updated!",
        description: "Your post has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      navigate(`/post/${post.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: (data) => {
      form.setValue("featuredImage", data.url);
      toast({
        title: "Image uploaded!",
        description: "Featured image has been set.",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImageMutation.mutate(file);
    }
  };

  const onSubmit = (data: any) => {
    // Auto-generate excerpt if not provided
    if (!data.excerpt) {
      const plainText = data.content.replace(/[#*`>-]/g, '').slice(0, 200);
      data.excerpt = plainText.length === 200 ? plainText + '...' : plainText;
    }

    if (id && existingPost) {
      updatePostMutation.mutate(data);
    } else {
      createPostMutation.mutate(data);
    }
  };

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText = before + selectedText + after;
    
    const currentContent = form.getValues("content");
    const newContent = currentContent.substring(0, start) + newText + currentContent.substring(end);
    
    form.setValue("content", newContent);
    setContent(newContent);
  };

  if (isLoading && id) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8 w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary" data-testid="editor-title">
          {id ? "Edit Post" : "Create New Post"}
        </h1>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => form.handleSubmit(onSubmit)()}
            disabled={createPostMutation.isPending || updatePostMutation.isPending}
            data-testid="save-draft-button"
          >
            Save Draft
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={createPostMutation.isPending || updatePostMutation.isPending}
            data-testid="publish-button"
          >
            {createPostMutation.isPending || updatePostMutation.isPending ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            {/* Post Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter post title..." data-testid="input-title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional subtitle..." data-testid="input-subtitle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description (auto-generated if left empty)" 
                          data-testid="textarea-excerpt"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Featured Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div 
                    className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    data-testid="image-upload-area"
                  >
                    <i className="fas fa-cloud-upload-alt text-3xl text-secondary mb-4"></i>
                    <p className="text-secondary mb-2">Drop your image here or click to browse</p>
                    <p className="text-sm text-gray-400">Supports JPG, PNG, WebP (max 2MB)</p>
                    <input 
                      id="image-upload"
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      data-testid="input-image-upload"
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/image.jpg" 
                            data-testid="input-featured-image-url"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("featuredImage") && (
                    <div className="mt-4">
                      <img 
                        src={form.watch("featuredImage")} 
                        alt="Featured image preview"
                        className="w-full h-32 object-cover rounded-lg"
                        data-testid="featured-image-preview"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Markdown Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Markdown Editor
                  <div className="flex space-x-2">
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={() => insertMarkdown("**", "**")}
                      title="Bold"
                      data-testid="format-bold"
                    >
                      <i className="fas fa-bold"></i>
                    </Button>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={() => insertMarkdown("*", "*")}
                      title="Italic"
                      data-testid="format-italic"
                    >
                      <i className="fas fa-italic"></i>
                    </Button>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={() => insertMarkdown("## ")}
                      title="Heading"
                      data-testid="format-heading"
                    >
                      <i className="fas fa-heading"></i>
                    </Button>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={() => insertMarkdown("[", "](url)")}
                      title="Link"
                      data-testid="format-link"
                    >
                      <i className="fas fa-link"></i>
                    </Button>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={() => insertMarkdown("![alt](", ")")}
                      title="Image"
                      data-testid="format-image"
                    >
                      <i className="fas fa-image"></i>
                    </Button>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={() => insertMarkdown("`", "`")}
                      title="Code"
                      data-testid="format-code"
                    >
                      <i className="fas fa-code"></i>
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Write your post content using Markdown..."
                          className="min-h-[400px] font-mono text-sm resize-none"
                          data-testid="textarea-content"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Live Preview
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={previewMode === "desktop" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPreviewMode("desktop")}
                      data-testid="preview-desktop"
                    >
                      <i className="fas fa-desktop mr-2"></i>Desktop
                    </Button>
                    <Button
                      type="button"
                      variant={previewMode === "tablet" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPreviewMode("tablet")}
                      data-testid="preview-tablet"
                    >
                      <i className="fas fa-tablet-alt mr-2"></i>Tablet
                    </Button>
                    <Button
                      type="button"
                      variant={previewMode === "mobile" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPreviewMode("mobile")}
                      data-testid="preview-mobile"
                    >
                      <i className="fas fa-mobile-alt mr-2"></i>Mobile
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className={`prose max-w-none markdown-content transition-all duration-200 ${
                    previewMode === "mobile" ? "max-w-sm mx-auto" :
                    previewMode === "tablet" ? "max-w-md mx-auto" : ""
                  }`}
                  data-testid="preview-content"
                >
                  {form.watch("title") && (
                    <h1 className="text-2xl font-bold text-primary mb-4">
                      {form.watch("title")}
                    </h1>
                  )}
                  
                  {content ? (
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-2xl font-bold text-primary mt-6 mb-3">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-lg font-semibold text-primary mt-4 mb-2">{children}</h3>,
                        p: ({ children }) => <p className="font-serif leading-relaxed text-gray-700 mb-4">{children}</p>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-accent pl-4 my-6 italic text-gray-600">
                            {children}
                          </blockquote>
                        ),
                        ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-700">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-gray-700">{children}</ol>,
                        li: ({ children }) => <li className="text-gray-700">{children}</li>,
                        code: ({ children }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                        pre: ({ children }) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-gray-400 italic">Start typing to see live preview...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
