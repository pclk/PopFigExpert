'use client';
import { useState, } from 'react';
import { useActions } from 'ai/rsc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'ai';
 
type ChatHistory = {
  id: string;
  user: string;
  message: string;
  timestamp: string;
};

const AddChatPage = () => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const { fetchChatHistory, insertChatHistory, deleteChatHistory} = useActions();

  async function invalidateUntilDataChanges() {
    const maxRetries = 5;
    const retryDelay = 250; // Delay between retries in milliseconds
    let retries = 0;
    let previousData = chatHistory.data;
  
    while (retries < maxRetries) {
      try {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));

        // Invalidate the query
        await queryClient.invalidateQueries({ queryKey: ['chat-history'] });
  
        // Wait for the query to settle
        await queryClient.prefetchQuery({ queryKey: ['chat-history'], queryFn: async () => await fetchChatHistory() });
  
        // Get the updated data
        const updatedData = queryClient.getQueryData(['chat-history']) as ChatHistory[];
  
        // Compare the updated data with the previous data
        if (JSON.stringify(updatedData) !== JSON.stringify(previousData)) {
          // Data has changed, break the loop
          return true;
        }

        // Increment the retry count and wait before the next retry
        retries++;
      } catch (error) {
        console.error('Error occurred while invalidating and fetching data:', error);
        break;
      }
    }

    if (retries === maxRetries) {
      console.warn('Data did not change after maximum retries');
      return false;
    }
  
    return false;
  }

  function useChatHistoryQuery() {
    return useQuery({
      queryKey: ['chat-history'],
      queryFn: async (): Promise<ChatHistory[]> => {
        return fetchChatHistory();
      },
    });
  }

  function useInsertChatHistoryMutation() {
    return useMutation({
      mutationFn: async (data: { id: string, user: string; message: string; timestamp: string }) => {
        return insertChatHistory(data);
      },
      onSuccess: async () => {
        const dataChanged = await invalidateUntilDataChanges();
        if (!dataChanged) {
          console.log('Data did not change after mutation');
        }
      },
    });
  }
  function useDeleteChatHistoryMutation() {
    return useMutation({
      mutationFn: async (id: string) => {
        return deleteChatHistory(id);
      },
      onSettled: async () => {
        await invalidateUntilDataChanges();
      },
    });
  }

  const chatHistory = useChatHistoryQuery();
  const insertMutation = useInsertChatHistoryMutation();
  const deleteMutation = useDeleteChatHistoryMutation();

  return (
    <div>
      <h1>Add Chat</h1>
      <form onSubmit={(e)=> {
        e.preventDefault();
        setUser('');
        setMessage('');
        insertMutation.mutate({ id: nanoid() ,user, message, timestamp: new Date().toISOString() });
      }
      }>
        <div>
          <label htmlFor="user">User:</label>
          <input type="text" id="user" value={user} onChange={(e) => setUser(e.target.value)} />
        </div>
        <div>
          <label htmlFor="message">Message:**</label>
          <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
        </div>
        <button type="submit">
          {insertMutation.isPending ? 'Adding...' : 'Add Chat'}
        </button>
      </form>
      <h2>Chat History</h2>
      {chatHistory.isError &&   <div>
    An error occurred while fetching chat history:
    <pre>{JSON.stringify(chatHistory.error)}</pre>
  </div>}
      {chatHistory.isSuccess && (
        <>
{chatHistory.data?.map((chat: ChatHistory) => (
  <div key={chat.id}
  className={(deleteMutation.isPending && deleteMutation.variables === chat.id) ? 'opacity-50' : ''}>
      <p>ID: {chat.id}</p>
    <p>User: {chat.user}</p>
    <p>Message: {chat.message}</p>
    <p>Timestamp: {chat.timestamp}</p>
    <button
      onClick={() => deleteMutation.mutate(chat.id)}
    >
      {deleteMutation.isPending && deleteMutation.variables === chat.id
        ? 'Deleting...'
        : 'Delete'}
    </button>
  </div>
))}
        {insertMutation.isPending && <div className="opacity-50">
            <p>ID: {insertMutation.variables.id}</p>
            <p>User: {insertMutation.variables.user}</p>
            <p>Message: {insertMutation.variables.message}</p>
            <p>Timestamp: {insertMutation.variables.timestamp}</p>
            <button disabled>Delete</button>
          </div>}
        </>
    )}
    {(chatHistory.isSuccess && chatHistory.data?.length === 0) && <div>No chat history available</div>}
    {chatHistory.isPending && <div>Loading...</div>}
    </div>
  );
};

export default AddChatPage;