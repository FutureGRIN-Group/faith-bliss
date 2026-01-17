import { Request, Response } from "express";
import { db } from "../config/firebase-admin";
import { ConversationSummary } from "../types/chat";
import { getUserIdFromRequest } from "./conversationController";
import { Timestamp } from "firebase-admin/firestore";

export async function createMessage(req: Request, res: Response) {
  try {
    // Retrieve user ID from request
    const userId = getUserIdFromRequest(req);

    // Check if conversation id exists
    const { conversationId } = req.body;

    const conversation = await db
      .collection("conversations")
      .doc(conversationId)
      .get();

    if (!conversation.exists) {
      res.status(404).json({
        message: "Conversation not found",
        status: "NOT_FOUND",
      });
    }

    // Check if user is a participant of Conversation
    const participants = (conversation.data() as ConversationSummary)
      .participants;
    const isParticipant = participants.includes(userId);

    if (!isParticipant) {
      return res.status(403).json({
        message: "User is not a participant of this conversation",
        status: "FORBIDDEN",
      });
    }

    // Message Content Validation
    // Check if text is empty
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        message: "Message text is required",
        status: "BAD_REQUEST",
      });
    }

    if (text.length > 2000) {
      return res.status(400).json({
        message: "Message text must be less than 2000 characters",
        status: "BAD_REQUEST",
      });
    }

    // When all conditions are met, create message document
    await db.collection("messages").add({
      conversationId,
      senderId: userId,
      receiverId: participants.find((id) => id !== userId),
      text,
      isRead: false,
      createdAt: Timestamp.now(),
      editedAt: null,
    });

    return res.status(201).json({
      message: "Message created successfully",
      status: "CREATED",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      status: "INTERNAL_SERVER_ERROR",
    });
  }
}
