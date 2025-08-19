import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { type Post } from "@shared/schema";
import PostCard from "@/components/post-card";

export default function Home() {
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded mb-6 max-w-2xl mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded max-w-3xl mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3 w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Posts</h1>
          <p className="text-gray-600">Failed to load blog posts. Please try again later.</p>
        </div>
      </div>
    );
  }

  const featuredPost = posts?.[0];
  const recentPosts = posts?.slice(1) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16" data-testid="hero-section">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 animate-fade-in">
          Digital Aadhti Blog
        </h1>
        <p className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed animate-slide-up">
          Insights into agricultural technology, commission management, and grain market innovations.
        </p>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="mb-16" data-testid="featured-post-section">
          <h2 className="text-2xl font-semibold text-primary mb-8">Featured Post</h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden blog-card">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={featuredPost.featuredImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"} 
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover" 
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <span className="text-sm text-accent font-medium bg-blue-50 px-3 py-1 rounded-full">
                    {featuredPost.category}
                  </span>
                  <span className="text-sm text-secondary ml-4">
                    {new Date(featuredPost.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {featuredPost.title}
                </h3>
                <p className="text-secondary leading-relaxed mb-6">
                  {featuredPost.excerpt}
                </p>
                <Link href={`/post/${featuredPost.id}`}>
                  <button 
                    className="text-accent font-medium hover:text-blue-600 transition-colors"
                    data-testid="featured-post-read-more"
                  >
                    Read More <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Grid */}
      <section data-testid="recent-posts-section">
        <h2 className="text-2xl font-semibold text-primary mb-8">Recent Posts</h2>
        
        {recentPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary">No posts available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
