import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Card } from "react-native-paper";
import {
  Bot,
  Send,
  Lightbulb,
  BookOpen,
  MessageSquare,
} from "lucide-react-native";
import { generateAIResponse } from "../lib/aiTutorService";

export function AITutor() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "こんにちは！私はあなたの日本語の先生です。\n何を学びたいですか？\n\n(Hello! I'm your Japanese teacher.\nWhat would you like to learn?)",
      type: "encouragement",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    "Explain the difference between は and が",
    "How do I use the て-form?",
    "What's the difference between です and である?",
    "Help me with keigo (polite language)",
    "Explain Japanese sentence structure",
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const grammarFocus = ["は vs が", "て-form", "です/である"];
      const aiResponse = await generateAIResponse(
        updatedMessages,
        grammarFocus
      );

      // Format response to preserve line breaks
      const formattedResponse = aiResponse.replace(/\n/g, "\n");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: formattedResponse,
          type: "explanation",
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `すみません、エラーが発生しました: ${error.message}\n(Sorry, an error occurred: ${error.message})`,
          type: "correction",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case "explanation":
        return <Lightbulb size={16} color="#f59e0b" />;
      case "correction":
        return <BookOpen size={16} color="#ef4444" />;
      case "encouragement":
        return <MessageSquare size={16} color="#10b981" />;
      default:
        return <Bot size={16} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image
              source={require("../assets/logo-ruby-chan.jpg")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Ruby Chan AI</Text>
          </View>
          <Text style={styles.subtitle}>
            Get personalized help with Japanese grammar and language learning
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Title
            title="AI Japanese Tutor"
            subtitle="Ask questions about Japanese grammar, vocabulary, or culture"
            left={(props) => <Bot {...props} size={20} />}
          />
          <Card.Content>
            {/* Quick Questions */}
            <View style={styles.quickQuestionsContainer}>
              <Text style={styles.sectionTitle}>Quick Questions:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.quickQuestions}>
                  {quickQuestions.map((question, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.quickQuestionButton}
                      onPress={() => handleQuickQuestion(question)}
                    >
                      <Text style={styles.quickQuestionText}>{question}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Chat Messages */}
            <ScrollView
              style={styles.chatContainer}
              contentContainerStyle={styles.chatContentContainer}
            >
              {messages.map((message, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageContainer,
                    message.role === "user"
                      ? styles.userMessageContainer
                      : styles.assistantMessageContainer,
                  ]}
                >
                  <View
                    style={[
                      styles.messageContent,
                      message.role === "user"
                        ? styles.userMessageContent
                        : styles.assistantMessageContent,
                    ]}
                  >
                    {message.role === "assistant" && (
                      <View style={styles.messageIcon}>
                        {getMessageIcon(message.type)}
                      </View>
                    )}
                    <View style={styles.messageTextContainer}>
                      <Text
                        style={[
                          styles.messageText,
                          message.role === "user"
                            ? styles.userMessageText
                            : styles.assistantMessageText,
                        ]}
                      >
                        {message.content}
                      </Text>
                      {message.type && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{message.type}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
              {isLoading && (
                <View style={styles.assistantMessageContainer}>
                  <View style={styles.assistantMessageContent}>
                    <ActivityIndicator size="small" color="#3b82f6" />
                    <Text style={{ marginLeft: 8 }}>
                      考え中... (Thinking...)
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ask me anything about Japanese..."
                value={input}
                onChangeText={setInput}
                multiline
                editable={!isLoading}
                onSubmitEditing={handleSendMessage}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!input.trim() || isLoading) && styles.disabledButton,
                ]}
                onPress={handleSendMessage}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Send size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    maxWidth: "80%",
  },
  card: {
    width: "100%",
    marginBottom: 16,
  },
  quickQuestionsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#666",
  },
  quickQuestions: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  quickQuestionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  quickQuestionText: {
    fontSize: 12,
  },
  chatContainer: {
    height: 400,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  chatContentContainer: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessageContainer: {
    alignItems: "flex-end",
  },
  assistantMessageContainer: {
    alignItems: "flex-start",
  },
  messageContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    maxWidth: "80%",
    padding: 12,
    borderRadius: 8,
  },
  userMessageContent: {
    backgroundColor: "#3b82f6",
    flexDirection: "row-reverse",
  },
  assistantMessageContent: {
    backgroundColor: "#f3f4f6",
  },
  messageIcon: {
    marginRight: 8,
  },
  messageTextContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    flexShrink: 1,
    flexWrap: "wrap",
    whiteSpace: "pre-line",
  },
  userMessageText: {
    color: "#fff",
  },
  assistantMessageText: {
    color: "#333",
  },
  badge: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#fff",
  },
  badgeText: {
    fontSize: 12,
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 60,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20, // Nếu muốn bo tròn
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    maxWidth: "80%",
    lineHeight: 20,
  },
});
