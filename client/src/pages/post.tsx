import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { type Post, type Comment, insertCommentSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import CommentSection from "@/components/comment-section";
import { useToast } from "@/hooks/use-toast";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: post, isLoading: postLoading, error: postError } = useQuery<Post>({
    queryKey: ["/api/posts", id],
    enabled: !!id,
  });

  const { data: comments = [], isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: ["/api/posts", id, "comments"],
    enabled: !!id,
  });

  const sharePost = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";
    
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Post URL has been copied to clipboard.",
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  if (postLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded mb-6 max-w-3xl mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded max-w-2xl mx-auto"></div>
          </div>
          <div className="h-64 md:h-96 bg-gray-200 rounded-2xl mb-12"></div>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Post Not Found</h1>
          <p className="text-gray-600">The requested post could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Post Header */}
      <header className="text-center mb-12" data-testid="post-header">
        <div className="flex items-center justify-center mb-4">
          <span className="text-sm text-accent font-medium bg-blue-50 px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-sm text-secondary ml-4">
            {new Date(post.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-xl text-secondary leading-relaxed max-w-2xl mx-auto">
            {post.subtitle}
          </p>
        )}
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mb-12" data-testid="post-featured-image">
          <img 
            src={post.featuredImage} 
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg" 
          />
        </div>
      )}

      {/* Post Content */}
      <article className="prose prose-lg max-w-none markdown-content" data-testid="post-content">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-bold text-primary mt-8 mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
              p: ({ children }) => <p className="font-serif text-lg leading-relaxed text-gray-700 mb-6">{children}</p>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-accent pl-6 my-8 italic text-lg text-secondary">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700">{children}</ol>,
              li: ({ children }) => <li className="text-gray-700">{children}</li>,
              code: ({ children }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
              pre: ({ children }) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6">{children}</pre>,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* Social Sharing */}
      <div className="flex items-center justify-center space-x-4 my-12" data-testid="social-sharing">
        <span className="text-secondary text-sm">Share this post:</span>
        <button 
          onClick={() => sharePost("twitter")}
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
          data-testid="share-twitter"
        >
          <i className="fab fa-twitter"></i>
        </button>
        <button 
          onClick={() => sharePost("facebook")}
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
          data-testid="share-facebook"
        >
          <i className="fab fa-facebook-f"></i>
        </button>
        <button 
          onClick={() => sharePost("linkedin")}
          className="bg-blue-700 text-white p-3 rounded-full hover:bg-blue-800 transition-colors"
          data-testid="share-linkedin"
        >
          <i className="fab fa-linkedin-in"></i>
        </button>
        <button 
          onClick={() => sharePost("copy")}
          className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition-colors"
          data-testid="share-copy"
        >
          <i className="fas fa-link"></i>
        </button>
      </div>

      {/* Comments Section */}
      <CommentSection postId={post.id} comments={comments} />
    </div>
  );
}
