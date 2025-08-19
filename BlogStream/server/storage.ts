import { type User, type InsertUser, type Post, type InsertPost, type Comment, type InsertComment } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPosts(): Promise<Post[]>;
  getPost(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;
  
  getCommentsByPostId(postId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<string, Post>;
  private comments: Map<string, Comment>;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    
    // Add some initial sample posts for Digital Aadhti
    this.initializeSamplePosts();
  }

  private initializeSamplePosts() {
    const samplePosts: Post[] = [
      {
        id: "1",
        title: "Digital Transformation in Agricultural Markets",
        subtitle: "How technology is revolutionizing grain trading and commission management",
        content: `# Digital Transformation in Agricultural Markets

The agricultural sector is experiencing a digital revolution that's transforming how grain markets operate, from commission calculations to broker management systems.

## The Evolution of Agricultural Technology

Traditional paper-based systems are giving way to sophisticated digital platforms that streamline operations, improve accuracy, and provide real-time insights into market trends.

> "Digital Aadhti represents the future of agricultural market management - where technology meets tradition to create more efficient and transparent trading processes."

## Key Benefits of Digital Market Systems

Modern agricultural market platforms offer several advantages:

- **Automated Commission Calculations:** Eliminate manual errors and speed up processing
- **Real-time Market Data:** Access to current prices and trends
- **Transparent Transactions:** Complete audit trails for all operations
- **Efficient Broker Management:** Streamlined processes for market intermediaries

## The Digital Aadhti Advantage

Our platform combines traditional market knowledge with cutting-edge technology to provide:

### Advanced Commission Management
- Automated calculation systems
- Customizable rate structures
- Real-time reporting and analytics

### Market Intelligence
- Price trend analysis
- Historical data insights
- Predictive market modeling

The future of agricultural markets lies in embracing digital transformation while preserving the essential human relationships that drive successful trading.`,
        excerpt: "Discover how Digital Aadhti is transforming agricultural markets through innovative technology that streamlines commission calculations and broker management.",
        category: "Technology",
        featuredImage: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15"),
      },
      {
        id: "2",
        title: "Understanding Commission Structures in Grain Markets",
        subtitle: "A comprehensive guide to commission calculations for brokers and aadhtis",
        content: `# Understanding Commission Structures in Grain Markets

Commission management is at the heart of successful grain market operations. Understanding different commission structures and calculation methods is crucial for brokers and aadhtis.

## Types of Commission Structures

### Fixed Rate Commissions
A predetermined amount per unit of grain traded, regardless of market price fluctuations.

### Percentage-Based Commissions
Calculated as a percentage of the total transaction value, providing flexibility with market conditions.

### Tiered Commission Systems
Different rates based on volume tiers, encouraging larger transactions with reduced rates for high-volume traders.

## Digital Aadhti's Commission Management Features

### Automated Calculations
Our system automatically calculates commissions based on your configured rates and transaction details.

### Flexible Rate Structures
- Support for multiple commission types
- Custom rate configurations per client
- Seasonal rate adjustments
- Volume-based incentive programs

### Comprehensive Reporting
- Real-time commission tracking
- Detailed transaction reports
- Performance analytics
- Tax-ready documentation

## Best Practices for Commission Management

1. **Transparency:** Always clearly communicate commission structures to clients
2. **Consistency:** Apply rates fairly across similar transactions
3. **Documentation:** Maintain detailed records for all commission calculations
4. **Regular Review:** Periodically assess and adjust rates based on market conditions

Digital Aadhti simplifies these processes, ensuring accuracy and transparency in all your commission calculations.`,
        excerpt: "Learn about different commission structures in grain markets and how Digital Aadhti simplifies commission calculations for brokers and market intermediaries.",
        category: "Business",
        featuredImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        createdAt: new Date("2024-03-12"),
        updatedAt: new Date("2024-03-12"),
      },
      {
        id: "3",
        title: "Market Analytics and Reporting Tools",
        subtitle: "Leveraging data insights for better grain market decisions",
        content: `# Market Analytics and Reporting Tools

Data-driven decision making is essential in today's competitive grain markets. Digital Aadhti provides comprehensive analytics and reporting tools to give you the insights you need.

## Real-Time Market Intelligence

### Price Trend Analysis
Track price movements across different grain varieties and identify market patterns.

### Volume Analytics
Monitor trading volumes to understand market activity and identify opportunities.

### Seasonal Patterns
Analyze historical data to predict seasonal trends and plan your trading strategies accordingly.

## Advanced Reporting Features

### Commission Reports
- Detailed commission breakdowns by client
- Period-over-period comparisons
- Performance metrics and KPIs

### Transaction Analytics
- Complete transaction histories
- Client behavior analysis
- Market share insights

### Financial Dashboards
- Real-time revenue tracking
- Profit margin analysis
- Cash flow projections

## Custom Report Builder

Create custom reports tailored to your specific needs:

1. **Flexible Filters:** Filter by date range, client, grain type, or custom criteria
2. **Multiple Formats:** Export reports in PDF, Excel, or CSV formats
3. **Scheduled Reports:** Automatically generate and email reports on a schedule
4. **Interactive Charts:** Visualize data with dynamic charts and graphs

## Benefits of Data-Driven Operations

- **Improved Decision Making:** Base decisions on concrete data rather than intuition
- **Risk Management:** Identify potential risks before they impact your business
- **Client Insights:** Better understand client needs and preferences
- **Operational Efficiency:** Optimize processes based on performance data

Digital Aadhti's analytics suite transforms raw transaction data into actionable business intelligence.`,
        excerpt: "Explore Digital Aadhti's powerful analytics and reporting tools that transform market data into actionable insights for grain market professionals.",
        category: "Analytics",
        featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date("2024-03-10"),
      }
    ];

    samplePosts.forEach(post => {
      this.posts.set(post.id, post);
    });

    // Add sample comments
    const sampleComments: Comment[] = [
      {
        id: "1",
        postId: "1",
        author: "Raj Patel",
        email: "raj@grainmarket.com",
        content: "Excellent overview of digital transformation in agriculture! We've been using Digital Aadhti for our commission management and the automation has saved us countless hours. The real-time reporting is particularly valuable.",
        createdAt: new Date("2024-03-16T10:00:00Z"),
      },
      {
        id: "2",
        postId: "1",
        author: "Priya Sharma",
        email: "priya@agritech.in",
        content: "As someone who's worked in traditional markets for years, I can attest to how much technology has improved our operations. Digital Aadhti's approach to preserving relationships while embracing innovation is spot on.",
        createdAt: new Date("2024-03-15T14:30:00Z"),
      },
      {
        id: "3",
        postId: "2",
        author: "Suresh Kumar",
        email: "suresh@marketbroker.com",
        content: "The commission calculation features are incredibly helpful. The transparency and accuracy it provides has improved our client relationships significantly.",
        createdAt: new Date("2024-03-13T09:15:00Z"),
      }
    ];

    sampleComments.forEach(comment => {
      this.comments.set(comment.id, comment);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPost(id: string): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = randomUUID();
    const now = new Date();
    const post: Post = { 
      ...insertPost, 
      id, 
      createdAt: now, 
      updatedAt: now,
      subtitle: insertPost.subtitle || null,
      featuredImage: insertPost.featuredImage || null
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: string, updateData: Partial<InsertPost>): Promise<Post | undefined> {
    const existingPost = this.posts.get(id);
    if (!existingPost) return undefined;
    
    const updatedPost: Post = {
      ...existingPost,
      ...updateData,
      updatedAt: new Date(),
    };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: string): Promise<boolean> {
    return this.posts.delete(id);
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }
}

export const storage = new MemStorage();