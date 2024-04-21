"use client";
import { useState } from "react";
import { useActions } from "ai/rsc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "ai";
import { AIState } from "@/app/action";

const AddChatPage = () => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const { fetchChatHistory, insertChatHistory, deleteChatHistory } =
    useActions();

  async function invalidateUntilDataChanges() {
    const maxRetries = 5;
    const retryDelay = 250; // Delay between retries in milliseconds
    let retries = 0;
    let previousData = chatHistory.data;

    while (retries < maxRetries) {
      try {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));

        // Invalidate the query
        await queryClient.invalidateQueries({ queryKey: ["chat-history"] });

        // Wait for the query to settle
        await queryClient.prefetchQuery({
          queryKey: ["chat-history"],
          queryFn: async () => await fetchChatHistory(),
        });

        // Get the updated data
        const updatedData = queryClient.getQueryData([
          "chat-history",
        ]) as AIState[];

        // Compare the updated data with the previous data
        if (JSON.stringify(updatedData) !== JSON.stringify(previousData)) {
          // Data has changed, break the loop
          return true;
        }

        // Increment the retry count and wait before the next retry
        retries++;
      } catch (error) {
        console.error(
          "Error occurred while invalidating and fetching data:",
          error,
        );
        break;
      }
    }

    if (retries === maxRetries) {
      console.warn("Data did not change after maximum retries");
      return false;
    }

    return false;
  }

  function useChatHistoryQuery() {
    return useQuery({
      queryKey: ["chat-history"],
      queryFn: async (): Promise<AIState[]> => {
        return fetchChatHistory();
      },
    });
  }

  function useInsertChatHistoryMutation() {
    return useMutation({
      mutationFn: async (data: AIState) => {
        return insertChatHistory([data]);
      },
      onSuccess: async () => {
        const dataChanged = await invalidateUntilDataChanges();
        if (!dataChanged) {
          console.log("Data did not change after mutation");
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const newChatEntry: AIState = {
            role: "user",
            content: message,
            id: nanoid(),
            name: user,
          };
          insertMutation.mutate(newChatEntry);
          setUser("");
          setMessage("");
        }}
      >
        <div>
          <label htmlFor="user">User:</label>
          <input
            type="text"
            id="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">
          {insertMutation.isPending ? "Adding..." : "Add Chat"}
        </button>
      </form>
      <h2>Chat History</h2>
      {chatHistory.isError && (
        <div>
          An error occurred while fetching chat history:
          <pre>{JSON.stringify(chatHistory.error)}</pre>
        </div>
      )}
      {chatHistory.isSuccess && (
        <>
          {chatHistory.data?.map((entry: AIState) => (
            <div
              key={entry.id}
              className={
                deleteMutation.isPending &&
                deleteMutation.variables === entry.id
                  ? "opacity-50"
                  : ""
              }
            >
              <p>ID: {entry.id}</p>
              <p>User: {entry.name}</p>
              <p>Message: {entry.content}</p>
              <button onClick={() => deleteMutation.mutate(entry.id)}>
                {deleteMutation.isPending &&
                deleteMutation.variables === entry.id
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          ))}
          {insertMutation.isPending && (
            <div className="opacity-50">
              <p>ID: {insertMutation.variables.id}</p>
              <p>User: {insertMutation.variables.name}</p>
              <p>Message: {insertMutation.variables.content}</p>
              <button disabled>Delete</button>
            </div>
          )}
        </>
      )}
      {chatHistory.isSuccess && chatHistory.data?.length === 0 && (
        <div>No chat history available</div>
      )}
      {chatHistory.isLoading && <div>Loading...</div>}
    </div>
  );
};

export default AddChatPage;
