import { config } from '../../config.ts';
import { Discussion } from './discussionList.tsx'
const { disc } = config.api;

  
  // interface Filter {
  //   sort: 'latest' | 'popular';
  //   tag: string;
  // }
  
  export interface Comment {
    content: string;
    author: string;
    author_id: string;
    createdAt: string;
  }

  interface CreateDiscussionResponse {
    id: number;
    title: string;
    author: string;
    createdAt: string;
    content: string;
  }
  
  // Fetch list of discussions
  // ?page=${page}&sort=${filter.sort}&tag=${filter.tag}
  export const fetchDiscussions = async (): Promise<Discussion[]> => {
    const response = await fetch(`${disc}/user/discussion`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  
  // Create new discussion
  export const createDiscussion = async (newDiscussion: { title: string; content: string}, user: any ): Promise<any> => {
    const response = await fetch(`${disc}/user/discussion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.uid}`,
      },
      body: JSON.stringify(newDiscussion),
      // credentials: 'include'
    });
  
    if (!response.ok) {
      throw new Error('Failed to create discussion');
    }
  
    return response.json();
  };

  // Add comment to a discussion
  export const addComment = async (discussionId: string, comment: { content: string }, user: any): Promise<any> => {
    const response = await fetch(`${disc}/user/discussion/${discussionId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.uid}`,
      },
      body: JSON.stringify(comment),
    });

    if (!response.ok) {
      throw new Error('Failed to add comment');
    }

    return response.json();
  };
  
  export const getDiscussionById = async (id: string): Promise<Discussion> => {
    const response = await fetch(`${disc}/user/discussion/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch discussion');
    }
    return response.json();
  };