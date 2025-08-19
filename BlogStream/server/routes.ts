import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertPostSchema, insertCommentSchema } from "@shared/schema";
import { z } from "zod";

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all posts
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Get single post
  app.get("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // Create new post
  app.post("/api/posts", async (req, res) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid post data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Update post
  app.patch("/api/posts/:id", async (req, res) => {
    try {
      const validatedData = insertPostSchema.partial().parse(req.body);
      const post = await storage.updatePost(req.params.id, validatedData);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid post data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  // Delete post
  app.delete("/api/posts/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Get comments for a post
  app.get("/api/posts/:postId/comments", async (req, res) => {
    try {
      const comments = await storage.getCommentsByPostId(req.params.postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Create comment
  app.post("/api/posts/:postId/comments", async (req, res) => {
    try {
      const commentData = {
        ...req.body,
        postId: req.params.postId,
      };
      const validatedData = insertCommentSchema.parse(commentData);
      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid comment data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Image upload endpoint
  app.post("/api/upload", upload.single('image'), (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // In a real application, you would upload to a cloud service like AWS S3
    // For now, we'll just return a placeholder URL
    const imageUrl = `https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600`;
    
    res.json({ 
      url: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
