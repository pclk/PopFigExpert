'use client';
import { useEffect, useState, useTransition } from 'react';
import { useActions } from 'ai/rsc';
import { useRouter } from 'next/navigation';
import { useOptimistic } from 'react';

type ChatHistory = {
  id: string;
  user: string;
  message: string;
  timestamp: string;
};

const AddChatPage = () => {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([] as ChatHistory[]);
  const { insertChatHistory, deleteChatHistory, fetchChatHistory, revalidateChatHistory } = useActions();
  const [isPending, startTransition] = useTransition();
  const [optimisticChatHistory, setOptimisticChatHistory] = useOptimistic(chatHistory);


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const timestamp = new Date().toISOString();
    console.log('Submitting chat history:', { user, message, timestamp: timestamp });
    setOptimisticChatHistory(prev => [
      ...prev,
      { id: Math.random(), user, message, timestamp },
    ]);
    const newChatId = await insertChatHistory(user, message, timestamp);
    console.log('optimistic insert:', { id: newChatId, user, message, timestamp });

    setUser('');
    setMessage('');
    // startTransition(async () => {
    //   const updatedHistory = await fetchChatHistory();
    //   setChatHistory(updatedHistory);
    // });
  } catch (error) {
    console.error('Error inserting chat history:', error);
  }
};

const handleDelete = async (id: string) => {
  try {
    console.log('Deleting chat history entry:', id);
    setOptimisticChatHistory(prev => prev.filter((chat) => chat.id !== id));
    await deleteChatHistory(id);
    // startTransition(async () => {
    //   const updatedHistory = await fetchChatHistory();
    //   setChatHistory(updatedHistory);
    // });
  } catch (error) {
    console.error('Error deleting chat history:', error);
  }
};


  useEffect(() => {
    const fetchHistory = async () => {
      try {
        startTransition(async () => {
          const history = await fetchChatHistory();
          setChatHistory(history);
        });
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <h1>Add Chat</h1>
      <button onClick={async (e) => {revalidateChatHistory();}}>refresh</button>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user">User:</label>
          <input type="text" id="user" value={user} onChange={(e) => setUser(e.target.value)} />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Adding...' : 'Add Chat'}
        </button>
      </form>
      <h2>Chat History</h2>
      {optimisticChatHistory.map((chat) => (
        <div key={chat.id}>
          <p>ID: {chat.id}</p>
          <p>User: {chat.user}</p>
          <p>Message: {chat.message}</p>
          <p>Timestamp: {chat.timestamp}</p>
          <button onClick={() => handleDelete(chat.id)} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AddChatPage;