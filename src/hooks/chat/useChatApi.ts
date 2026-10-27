import {
  getChatMessage,
  getChatRooms,
  postChatComplete,
  postCreateChatRoom,
} from "@/apis/chat/chatApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useChatApi = () => {
  const getChatRoomsQuery = (enabled = true) => {
    return useQuery({
      queryKey: ["chatRooms"],
      queryFn: getChatRooms,
      enabled,
    });
  };

  const postCreateChatRoomMutation = () => {
    return useMutation({
      mutationFn: postCreateChatRoom,
    });
  };

  const postChatCompleteMutation = () => {
    return useMutation({
      mutationFn: postChatComplete,
    });
  };

  const getChatMessageQuery = (roomId: number) => {
    return useQuery({
      queryKey: ["chatMessage", roomId],
      queryFn: () => getChatMessage(roomId),
      enabled: !!roomId && !isNaN(roomId),
    });
  };

  return {
    getChatRoomsQuery,
    postCreateChatRoomMutation,
    postChatCompleteMutation,
    getChatMessageQuery,
  };
};
