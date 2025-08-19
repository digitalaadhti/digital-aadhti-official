import { Link } from "wouter";
import { type Post } from "@shared/schema";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden blog-card" data-testid={`post-card-${post.id}`}>
      <img 
        src={post.featuredImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"} 
        alt={post.title}
        className="w-full h-48 object-cover" 
      />
      <div className="p-6">
        <div className="flex items-center mb-3">
          <span className="text-xs text-accent font-medium bg-blue-50 px-2 py-1 rounded">
            {post.category}
          </span>
          <span className="text-xs text-secondary ml-3">
            {new Date(post.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-primary mb-3 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <Link href={`/post/${post.id}`}>
          <button 
            className="text-accent font-medium text-sm hover:text-blue-600 transition-colors"
            data-testid={`post-card-read-more-${post.id}`}
          >
            Read More
          </button>
        </Link>
      </div>
    </article>
  );
}
