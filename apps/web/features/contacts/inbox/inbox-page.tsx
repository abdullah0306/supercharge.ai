'use client'

import * as React from 'react'
import {
  Box,
  Flex,
  Text,
  Avatar,
  Button,
  IconButton,
  Input,
  useColorModeValue,
  VStack,
  HStack,
  Divider,
  useToast,
  Spinner,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { FiMessageSquare, FiBox, FiMoreVertical, FiSearch, FiX } from 'react-icons/fi'
import { api } from '#lib/trpc/react'
import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'next/navigation'
import { WELCOME_MESSAGES } from '#lib/ai/config'

// Chat message component
interface ChatMessageProps {
  content: string
  timestamp: string
  isOutgoing: boolean
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, timestamp, isOutgoing }) => {
  const messageBg = useColorModeValue('gray.100', 'gray.700');
  
  return (
    <Flex 
      justify={isOutgoing ? "flex-end" : "flex-start"} 
      mb={4}
      mx={4}
    >
      <Box
        maxW="70%"
        bg={isOutgoing ? "blue.500" : messageBg}
        color={isOutgoing ? "white" : undefined}
        p={4}
        borderRadius="lg"
        boxShadow="sm"
      >
        <Text>{content}</Text>
        <Text 
          fontSize="xs" 
          color={isOutgoing ? "whiteAlpha.800" : "gray.500"} 
          mt={1}
        >
          {timestamp}
        </Text>
      </Box>
    </Flex>
  );
};

// Chat list item component
interface ChatListItemProps {
  name: string
  lastMessage: string
  time: string
  avatar?: string
  unreadCount?: number
  isOnline?: boolean
  isSelected?: boolean
  onClick: () => void
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  name,
  lastMessage,
  time,
  avatar,
  unreadCount,
  isOnline,
  isSelected,
  onClick,
}) => {
  const bg = useColorModeValue('white', 'gray.800')
  const selectedBg = useColorModeValue('gray.100', 'gray.700')
  const itemBorderColor = useColorModeValue('gray.100', 'gray.700')
  const avatarBorderColor = useColorModeValue('white', 'gray.800')

  return (
    <Flex
      p={3}
      cursor="pointer"
      bg={isSelected ? selectedBg : bg}
      _hover={{ bg: selectedBg }}
      onClick={onClick}
      borderBottom="1px"
      borderColor={itemBorderColor}
    >
      <Box position="relative">
        <Avatar name={name} src={avatar} size="md" />
        {isOnline && (
          <Box
            position="absolute"
            bottom="0"
            right="0"
            w="3"
            h="3"
            bg="green.500"
            borderRadius="full"
            border="2px"
            borderColor={avatarBorderColor}
          />
        )}
      </Box>
      <Box ml={3} flex={1}>
        <Flex justify="space-between" align="center">
          <Text fontWeight="bold">{name}</Text>
          <Text fontSize="xs" color="gray.500">
            {time}
          </Text>
        </Flex>
        <Flex justify="space-between" align="center">
          <Text fontSize="sm" color="gray.500" noOfLines={1}>
            {lastMessage}
          </Text>
          {unreadCount && (
            <Box
              bg="blue.500"
              color="white"
              borderRadius="full"
              px={2}
              py={0.5}
              fontSize="xs"
              fontWeight="bold"
            >
              {unreadCount}
            </Box>
          )}
        </Flex>
      </Box>
    </Flex>
  )
}

interface InboxListPageProps {
  params: { 
    workspace: string 
  }
  searchParams?: { [key: string]: string | string[] | undefined }
  data?: any
}

// Add these types at the top of the file
interface ChatMessage {
  assistant: string | null;
  user: string | null;
}

interface Message {
  content: string;
  timestamp: string;
  timeGroup?: string;
  isOutgoing: boolean;
  originalDate?: Date;
  isTimeSeparator?: boolean;
}

interface MessageGroup {
  date: string;
  messages: Message[];
}

// Add these interfaces and constants before the ChatMessage interface
interface QuickOption {
  text: string;
  onClick: () => void;
}

interface QuickOptionsProps {
  options: QuickOption[];
}

const QUICK_OPTIONS = {
  ai_assistant: [
    "What can you help me with?",
    "How do I use this workspace?",
    "Tell me about my recent activity",
    "Help me get started"
  ],
  sales_assistant: [
    "Draft a sales email",
    "Help with pricing strategy",
    "Create a proposal",
    "Competitive analysis"
  ],
  hr_assistant: [
    "Company policies",
    "Employee benefits",
    "Onboarding process",
    "Performance review guidelines"
  ],
  marketing_assistant: [
    "Create social media content",
    "Email campaign ideas",
    "SEO optimization tips",
    "Content strategy help"
  ],
  data_analyst: [
    "Analyze this dataset",
    "Create a visualization",
    "Statistical analysis help",
    "Data cleaning tips"
  ],
  bug_reporting: [
    "Report a new bug",
    "Track bug status",
    "Bug reproduction steps",
    "Priority assessment"
  ],
  rfp_response: [
    "RFP requirements analysis",
    "Draft proposal section",
    "Technical solution description",
    "Pricing strategy help"
  ]
};

// Add the QuickOptions component before the ChatMessage component
const QuickOptions: React.FC<QuickOptionsProps> = ({ options }) => {
  const buttonBg = useColorModeValue('white', 'gray.700');
  const buttonHoverBg = useColorModeValue('gray.100', 'gray.600');

  return (
    <Wrap spacing={2} p={4}>
      {options.map((option, index) => (
        <WrapItem key={index}>
          <Button
            size="sm"
            bg={buttonBg}
            _hover={{ bg: buttonHoverBg }}
            onClick={option.onClick}
            borderRadius="full"
            boxShadow="sm"
          >
            {option.text}
          </Button>
        </WrapItem>
      ))}
    </Wrap>
  );
};

export const InboxListPage: React.FC<InboxListPageProps> = ({ params, searchParams }) => {
  const routeParams = useParams()
  const workspaceId = params.workspace ?? routeParams?.workspace as string
  const toast = useToast()

  // Utility function to format dates like WhatsApp
  const formatChatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  // Utility function to format times
  const formatChatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Get assistant and conversationId from query params
  const initialAssistant = searchParams?.assistant === 'sales' 
    ? 'sales' 
    : searchParams?.assistant === 'hr'
      ? 'hr'
      : searchParams?.assistant === 'marketing'
        ? 'marketing'
        : searchParams?.assistant === 'data'
          ? 'data'
          : searchParams?.assistant === 'bug'
            ? 'bug'
            : searchParams?.assistant === 'rfp'
              ? 'rfp'
              : 'ai';
  const initialConversationId = searchParams?.conversationId as string || uuidv4()

  const [selectedChat, setSelectedChat] = React.useState<string>(initialAssistant)
  const [messageInput, setMessageInput] = React.useState('')
  const [conversationId] = React.useState<string>(initialConversationId)
  const [isAILoading, setIsAILoading] = React.useState(false)
  const [isWelcomeLoading, setIsWelcomeLoading] = React.useState(true)
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(!searchParams?.assistant)

  // Get current assistant type based on selected chat
  const currentAssistantType = React.useMemo(() => {
    switch (selectedChat) {
      case 'sales':
        return 'sales_assistant';
      case 'hr':
        return 'hr_assistant';
      case 'marketing':
        return 'marketing_assistant';
      case 'data':
        return 'data_analyst';
      case 'bug':
        return 'bug_reporting';
      case 'rfp':
        return 'rfp_response';
      default:
        return 'ai_assistant';
    }
  }, [selectedChat]);

  // Fetch user session first
  const { data: sessionData } = api.auth.me.useQuery(undefined, {
    retry: 1,
    staleTime: Infinity,
  });

  const session = React.useMemo(() => 
    sessionData ? { user: sessionData } : null
  , [sessionData]);

  // Update the chat data type
  const { data: chatData, refetch: refetchChat, isLoading: isChatLoading } = api.chat.getConversation.useQuery(
    { 
      workspaceId,
      conversationId,
      assistantType: currentAssistantType,
    }, 
    { 
      enabled: Boolean(workspaceId && currentAssistantType && sessionData),
      retry: false,
      staleTime: 0,
      refetchOnWindowFocus: false
    }
  );

  // Handle chat query errors separately
  React.useEffect(() => {
    if (!chatData && !isChatLoading) {
      console.error('Failed to load chat');
      toast({
        title: 'Error',
        description: 'Failed to load chat. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [chatData, isChatLoading, toast]);

  // Reset welcome loading when chat loads
  React.useEffect(() => {
    if (!isChatLoading) {
      setIsWelcomeLoading(false);
    }
  }, [isChatLoading]);

  // Handle query errors
  React.useEffect(() => {
    if (!workspaceId) {
      console.error('No workspace ID found');
      toast({
        title: 'Error',
        description: 'Workspace not found',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [workspaceId, toast]);

  // Move all hooks before any conditional returns
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  // Transform messages for display
  const currentMessages = React.useMemo(() => {
    if (!chatData || !chatData[currentAssistantType]) {
      return [];
    }

    const messages = chatData[currentAssistantType] as ChatMessage[];
    if (!Array.isArray(messages)) {
      console.error('Invalid messages format:', messages);
      return [];
    }

    const groupedMessages: MessageGroup[] = [];
    let currentDate = '';

    // If there are no messages, show the welcome message
    if (messages.length === 0) {
      const msgDate = new Date();
      const formattedDate = formatChatDate(msgDate);
      const formattedTime = formatChatTime(msgDate);
      
      groupedMessages.push({
        date: formattedDate,
        messages: [{
          content: WELCOME_MESSAGES[currentAssistantType],
          timestamp: formattedTime,
          timeGroup: '0-1',
          isOutgoing: false,
          originalDate: msgDate,
        }]
      });
      
      return groupedMessages;
    }

    messages.forEach((msg: ChatMessage) => {
      if (!msg) return;

      const msgDate = new Date();
      const formattedDate = formatChatDate(msgDate);
      const formattedTime = formatChatTime(msgDate);

      if (formattedDate !== currentDate) {
        currentDate = formattedDate;
        groupedMessages.push({
          date: formattedDate,
          messages: []
        });
      }

      const currentGroup = groupedMessages[groupedMessages.length - 1];
      
      if (msg.user !== null) {
        currentGroup.messages.push({
          content: msg.user,
          timestamp: formattedTime,
          timeGroup: '0-1',
          isOutgoing: true,
          originalDate: msgDate,
        });
      }
      
      if (msg.assistant !== null) {
        currentGroup.messages.push({
          content: msg.assistant,
          timestamp: formattedTime,
          timeGroup: '0-1',
          isOutgoing: false,
          originalDate: msgDate,
        });
      }
    });

    return groupedMessages;
  }, [chatData, currentAssistantType]);

  // Scroll to bottom when messages change
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentMessages]);

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const chatListBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const searchBg = useColorModeValue('gray.100', 'gray.700');
  const chatAreaBg = useColorModeValue('gray.100', 'gray.900');
  const messageInputBg = useColorModeValue('gray.100', 'gray.700');

  // Add validation for workspaceId
  React.useEffect(() => {
    if (!workspaceId) {
      console.error('No workspace ID found')
    }
  }, [workspaceId]);

  // Effect to handle sidebar visibility based on chat selection
  React.useEffect(() => {
    if (selectedChat) {
      setIsSidebarVisible(false);
    }
  }, [selectedChat]);

  // Show loading state when session is loading
  if (!sessionData) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner 
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    );
  }

  // Show error if no session
  if (!session?.user) {
    return (
      <Flex justify="center" align="center" h="100vh" direction="column" gap={4}>
        <Text>Please log in to access the chat</Text>
      </Flex>
    );
  }

  // Show error if no workspace
  if (!workspaceId) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text>Workspace not found</Text>
      </Flex>
    );
  }

  // Date Separator Component
  const DateSeparator = ({ date }: { date: string }) => (
    <Flex 
      align="center" 
      my={4} 
      mx={2}
    >
      <Divider flex={1} borderColor={useColorModeValue('gray.300', 'gray.600')} />
      <Text 
        px={3} 
        fontSize="sm" 
        color={useColorModeValue('gray.500', 'gray.400')} 
        bg={useColorModeValue('gray.50', 'gray.800')}
        borderRadius="full"
      >
        {date}
      </Text>
      <Divider flex={1} borderColor={useColorModeValue('gray.300', 'gray.600')} />
    </Flex>
  );

  // Time Separator Component
  const TimeSeparator = ({ time }: { time: string }) => (
    <Flex 
      align="center" 
      my={2} 
      mx={2}
      justifyContent="center"
    >
      <Text 
        px={3} 
        fontSize="xs" 
        color={useColorModeValue('gray.500', 'gray.400')} 
        bg={useColorModeValue('gray.100', 'gray.700')}
        borderRadius="full"
      >
        {time}
      </Text>
    </Flex>
  );

  // Handle close chat
  const handleCloseChat = () => {
    setSelectedChat('ai');
    setIsSidebarVisible(true);
  };

  const sendMessageMutation = api.chat.sendMessage.useMutation({
    onMutate: () => {
      setIsAILoading(true);
      // Optimistically add user message
      const userMessage = messageInput.trim();
      setMessageInput('');
      return { userMessage };
    },
    onSuccess: async (_, variables, context) => {
      try {
        await refetchChat();
      } catch (error) {
        console.error('Failed to refetch chat:', error);
        // Restore message input if refetch fails
        if (context?.userMessage) {
          setMessageInput(context.userMessage);
        }
      }
    },
    onError: (error, variables, context) => {
      console.error('Failed to send message:', error);
      // Restore message input on error
      if (context?.userMessage) {
        setMessageInput(context.userMessage);
      }
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
    onSettled: () => {
      setIsAILoading(false);
    }
  });

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !workspaceId || !sessionData) {
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        workspaceId,
        conversationId,
        message: messageInput.trim(),
        assistantType: currentAssistantType,
      });
    } catch (error) {
      // Error is handled in mutation callbacks
      console.error('Error in handleSendMessage:', error);
    }
  };

  if (!workspaceId) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text>Workspace not found</Text>
      </Flex>
    )
  }

  return (
    <Flex h="100vh" bg={bgColor} overflow="hidden">
      {/* Left sidebar with chat list */}
      <Box 
        w="350px" 
        bg={chatListBg} 
        borderRight="1px" 
        borderColor={borderColor}
        display={{ base: isSidebarVisible ? "block" : "none", md: "block" }}
      >
        {/* Header */}
        <Flex 
          p={4} 
          justify="space-between" 
          align="center" 
          borderBottom="1px" 
          borderColor={borderColor}
          pl={{ base: "40px", md: "44px" }}
        >
          <Text fontSize="xl" fontWeight="bold" pl={2}>
            Chats
          </Text>
          <HStack spacing={2}>
            <IconButton
              aria-label="Talk to AI"
              icon={<FiBox />}
              variant="ghost"
              colorScheme="blue"
              onClick={() => setSelectedChat('ai')}
            />
            <IconButton
              aria-label="More options"
              icon={<FiMoreVertical />}
              variant="ghost"
            />
          </HStack>
        </Flex>

        {/* Search bar */}
        <Box p={4}>
          <Flex
            as="form"
            align="center"
            bg={searchBg}
            rounded="full"
            px={4}
            py={2}
          >
            <FiSearch />
            <Input
              placeholder="Search chats..."
              border="none"
              _focus={{ border: 'none' }}
              ml={2}
              variant="unstyled"
            />
          </Flex>
        </Box>

        {/* Chat lists */}
        <VStack spacing={0} align="stretch" overflowY="auto" maxH="calc(100vh - 140px)">
          <ChatListItem
            name="AI Assistant"
            lastMessage="How can I help you today?"
            time="Now"
            avatar="/ai-avatar.png"
            isOnline={true}
            isSelected={selectedChat === 'ai'}
            onClick={() => setSelectedChat('ai')}
          />
          <ChatListItem
            name="Sales Assistant"
            lastMessage="Ready to help with sales!"
            time="Now"
            avatar="/sales-avatar.png"
            isOnline={true}
            isSelected={selectedChat === 'sales'}
            onClick={() => setSelectedChat('sales')}
          />
          <ChatListItem
            name="HR Assistant"
            lastMessage="Ready to help with HR matters!"
            time="Now"
            avatar="/hr-avatar.png"
            isOnline={true}
            isSelected={selectedChat === 'hr'}
            onClick={() => setSelectedChat('hr')}
          />
          <ChatListItem
            name="Marketing Assistant"
            lastMessage="Ready to help with marketing strategies!"
            time="Now"
            avatar="/marketing-avatar.png"
            isOnline={true}
            isSelected={selectedChat === 'marketing'}
            onClick={() => setSelectedChat('marketing')}
          />
          <ChatListItem
            name="Data Analyst"
            lastMessage="Ready to help with data analysis!"
            time="Now"
            avatar="/data-avatar.png"
            isOnline={true}
            isSelected={selectedChat === 'data'}
            onClick={() => setSelectedChat('data')}
          />
          <ChatListItem
            name="Bug Reporting Assistant"
            lastMessage="Ready to help with bug reports!"
            time="Now"
            avatar="/bug-avatar.png"
            isOnline={true}
            isSelected={selectedChat === 'bug'}
            onClick={() => setSelectedChat('bug')}
          />
          <ChatListItem
            name="RFP Response Assistant"
            lastMessage="Ready to help with RFP responses!"
            time="Now"
            avatar="/rfp-avatar.png"
            isOnline={true}
            isSelected={selectedChat === 'rfp'}
            onClick={() => setSelectedChat('rfp')}
          />
        </VStack>
      </Box>

      {/* Right side chat area */}
      <Flex flex={1} direction="column" bg={chatAreaBg} overflow="hidden">
        {selectedChat ? (
          <>
            {/* Chat header */}
            <Flex
              p={4}
              bg={chatListBg}
              borderBottom="1px"
              borderColor={borderColor}
              align="center"
            >
              <Avatar 
                name={
                  selectedChat === 'ai' 
                    ? 'AI Assistant' 
                    : selectedChat === 'sales'
                      ? 'Sales Assistant'
                      : selectedChat === 'hr'
                        ? 'HR Assistant'
                        : selectedChat === 'marketing'
                          ? 'Marketing Assistant'
                          : selectedChat === 'data'
                            ? 'Data Analyst'
                            : selectedChat === 'bug'
                              ? 'Bug Reporting Assistant'
                              : 'RFP Response Assistant'
                } 
                src={
                  selectedChat === 'ai' 
                    ? '/ai-avatar.png' 
                    : selectedChat === 'sales'
                      ? '/sales-avatar.png'
                      : selectedChat === 'hr'
                        ? '/hr-avatar.png'
                        : selectedChat === 'marketing'
                          ? '/marketing-avatar.png'
                          : selectedChat === 'data'
                            ? '/data-avatar.png'
                            : selectedChat === 'bug'
                              ? '/bug-avatar.png'
                              : '/rfp-avatar.png'
                }
                size="sm" 
              />
              <Box ml={3}>
                <Text fontWeight="bold">
                  {selectedChat === 'ai' 
                    ? 'AI Assistant' 
                    : selectedChat === 'sales'
                      ? 'Sales Assistant'
                      : selectedChat === 'hr'
                        ? 'HR Assistant'
                        : selectedChat === 'marketing'
                          ? 'Marketing Assistant'
                          : selectedChat === 'data'
                            ? 'Data Analyst'
                            : selectedChat === 'bug'
                              ? 'Bug Reporting Assistant'
                              : 'RFP Response Assistant'}
                </Text>
                <Text fontSize="xs" color="green.500">
                  Online
                </Text>
              </Box>
              <HStack ml="auto" spacing={2}>
                <IconButton
                  display={{ base: "flex", md: "none" }}
                  aria-label="Close chat"
                  icon={<FiX />}
                  variant="ghost"
                  onClick={handleCloseChat}
                />
                <IconButton
                  aria-label="More options"
                  icon={<FiMoreVertical />}
                  variant="ghost"
                />
              </HStack>
            </Flex>

            {/* Chat messages area */}
            <Flex
              ref={chatContainerRef}
              flex={1}
              direction="column"
              p={6}
              overflowY="auto"
              position="relative"
            >
              {/* Welcome message loader */}
              {(isWelcomeLoading || isChatLoading) && (
                <Flex justify="center" align="center" p={4} width="full">
                  <Spinner 
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                </Flex>
              )}

              {/* Only show messages when not loading */}
              {!isWelcomeLoading && !isChatLoading && (
                <>
                  {currentMessages.map((dateGroup: MessageGroup, groupIndex: number) => (
                    <React.Fragment key={groupIndex}>
                      {/* Date Separator */}
                      <DateSeparator date={dateGroup.date} />
                      
                      {/* Messages for this date */}
                      {dateGroup.messages.map((msg: Message, msgIndex: number) => (
                        msg.isTimeSeparator ? (
                          <TimeSeparator key={`time-${groupIndex}-${msgIndex}`} time={msg.content} />
                        ) : (
                          <ChatMessage 
                            key={`msg-${groupIndex}-${msgIndex}`} 
                            content={msg.content}
                            timestamp={msg.timestamp}
                            isOutgoing={msg.isOutgoing}
                          />
                        )
                      ))}
                    </React.Fragment>
                  ))}

                  {/* AI response loader */}
                  {isAILoading && (
                    <Flex justify="center" align="center" p={4}>
                      <Spinner 
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="xl"
                      />
                    </Flex>
                  )}
                </>
              )}
            </Flex>

            {/* Quick Options */}
            {selectedChat && (
              <QuickOptions
                options={QUICK_OPTIONS[
                  selectedChat === 'ai' ? 'ai_assistant' :
                  selectedChat === 'sales' ? 'sales_assistant' :
                  selectedChat === 'hr' ? 'hr_assistant' :
                  selectedChat === 'marketing' ? 'marketing_assistant' :
                  selectedChat === 'data' ? 'data_analyst' :
                  selectedChat === 'bug' ? 'bug_reporting' :
                  'rfp_response'
                ].map(text => ({
                  text,
                  onClick: () => {
                    setMessageInput(text);
                    // Directly send the message
                    sendMessageMutation.mutate({
                      workspaceId,
                      conversationId,
                      message: text,
                      assistantType: currentAssistantType,
                    });
                  }
                }))}
              />
            )}

            {/* Message input */}
            <Flex
              p={4}
              bg={chatListBg}
              borderTop="1px"
              borderColor={borderColor}
              align="center"
            >
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                bg={messageInputBg}
                borderRadius="full"
              />
              <Button
                ml={2}
                colorScheme="blue"
                borderRadius="full"
                px={6}
                isDisabled={!messageInput.trim() || !selectedChat}
                onClick={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              >
                Send
              </Button>
            </Flex>
          </>
        ) : (
          <Flex
            flex={1}
            align="center"
            justify="center"
            direction="column"
            color="gray.500"
          >
            <FiMessageSquare size={48} />
            <Text mt={4}>Select a chat to start messaging</Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

// Add default export
export default InboxListPage
