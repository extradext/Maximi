/**
 * FAISS Vector Search Integration
 * Local vector search for node similarity and recommendations
 */

import * as fs from 'fs';
import * as path from 'path';

// Simple in-memory vector store (FAISS-like behavior)
// In production, integrate actual FAISS library

interface VectorEntry {
  id: string;
  text: string;
  embedding: number[];
  metadata?: any;
}

class VectorStore {
  private vectors: VectorEntry[] = [];
  private dimension: number = 384; // Default embedding dimension

  /**
   * Add a vector to the store
   */
  add(id: string, text: string, embedding: number[], metadata?: any) {
    this.vectors.push({ id, text, embedding, metadata });
  }

  /**
   * Search for similar vectors using cosine similarity
   */
  search(queryEmbedding: number[], k: number = 5): VectorEntry[] {
    const similarities = this.vectors.map((entry) => ({
      entry,
      similarity: this.cosineSimilarity(queryEmbedding, entry.embedding),
    }));

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k)
      .map((s) => s.entry);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Get vector by ID
   */
  get(id: string): VectorEntry | undefined {
    return this.vectors.find((v) => v.id === id);
  }

  /**
   * Remove vector by ID
   */
  remove(id: string): boolean {
    const index = this.vectors.findIndex((v) => v.id === id);
    if (index > -1) {
      this.vectors.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Clear all vectors
   */
  clear() {
    this.vectors = [];
  }

  /**
   * Get total count
   */
  count(): number {
    return this.vectors.length;
  }
}

// Global vector store instance
let vectorStore: VectorStore | null = null;

export function getVectorStore(): VectorStore {
  if (!vectorStore) {
    vectorStore = new VectorStore();
  }
  return vectorStore;
}

/**
 * Generate a simple embedding (mock implementation)
 * In production, use actual embedding models (e.g., OpenAI embeddings)
 */
export function generateEmbedding(text: string): number[] {
  // Simple hash-based embedding for demo
  // Replace with actual embedding API in production
  const hash = simpleHash(text);
  const embedding: number[] = [];
  
  for (let i = 0; i < 384; i++) {
    embedding.push(Math.sin(hash + i) * Math.cos(hash * i));
  }
  
  return embedding;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}

export default { getVectorStore, generateEmbedding };