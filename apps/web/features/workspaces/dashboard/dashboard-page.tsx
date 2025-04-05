'use client'

import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  HStack,
  Stack,
  Card,
  CardBody,
  SimpleGrid,
  Heading,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react'
import {
  Page,
  PageBody,
} from '@saas-ui-pro/react'
import { LuPlus, LuArrowRight, LuUser } from 'react-icons/lu'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

interface DashboardPageProps {
  params: {
    workspace: string
  }
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ params: { workspace } }) => {
  // We have the workspace ID available if needed later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const workspaceId = workspace;

  const router = useRouter()

  // Assistant cards data
  const assistants = [
    {
      name: 'Sales Support Assistant',
      description: 'Specialized in sales support, helping with customer inquiries, sales strategies, and deal management.',
      initials: 'SA'
    },
    {
      name: 'HR Assistant',
      description: 'Provides guidance on HR policies, employee relations, and workplace procedures.',
      initials: 'HR'
    },
    {
      name: 'Marketing Assistant',
      description: 'Helps create marketing content, analyze campaigns, and maintain brand consistency.',
      initials: 'MA'
    },
    {
      name: 'Data Analyst',
      description: 'Analyzes data, generates insights, and helps with data visualization and reporting.',
      initials: 'DA'
    },
    {
      name: 'Bug Reporting Assistant',
      description: 'Assists with documenting bugs, creating detailed reports, and tracking technical issues.',
      initials: 'BR'
    },
    {
      name: 'RFP Response Assistant',
      description: 'Helps analyze RFP requirements and create comprehensive proposal responses.',
      initials: 'RA'
    },
    {
      name: 'Create New Assistant',
      description: '',
      isCreateNew: true
    }
  ]

  // Recent chats data
  const recentChats = [
    {
      title: 'August 7, 2024 - Untitled',
      assistant: 'No assistant',
      createdBy: 'Jason Fleming',
      lastUpdated: 'A few seconds ago',
    },
    {
      title: 'Customer Inquiry:Encryption Methods',
      assistant: 'Sales Support Assistant',
      createdBy: 'Jason Fleming',
      lastUpdated: '7 hours ago',
    },
    {
      title: 'Data Security Inquiry with SprinterSoftwareGroup',
      assistant: 'Sales Support Assistant',
      createdBy: 'Jason Fleming',
      lastUpdated: '7 hours ago',
    },
  ]

  // Add handleStartChat function
  const handleStartChat = (assistant: string) => {
    const conversationId = uuidv4()
    if (assistant === 'Sales Support Assistant') {
      router.push(`/${workspaceId}/inbox?assistant=sales&conversationId=${conversationId}`)
    } else if (assistant === 'HR Assistant') {
      router.push(`/${workspaceId}/inbox?assistant=hr&conversationId=${conversationId}`)
    } else if (assistant === 'Marketing Assistant') {
      router.push(`/${workspaceId}/inbox?assistant=marketing&conversationId=${conversationId}`)
    } else if (assistant === 'Data Analyst') {
      router.push(`/${workspaceId}/inbox?assistant=data&conversationId=${conversationId}`)
    } else if (assistant === 'Bug Reporting Assistant') {
      router.push(`/${workspaceId}/inbox?assistant=bug&conversationId=${conversationId}`)
    } else if (assistant === 'RFP Response Assistant') {
      router.push(`/${workspaceId}/inbox?assistant=rfp&conversationId=${conversationId}`)
    } else {
      router.push(`/${workspaceId}/inbox?assistant=ai&conversationId=${conversationId}`)
    }
  }

  const header = (
    <Flex 
      justify="space-between" 
      align="center"
      width="100%" 
      mb={8}
      gap={4}
      pl={{ base: "30px", md: "44px", lg: "0" }}
    >
      <Box maxW={{ base: "60%", sm: "100%" }} overflow="hidden">
        <Heading size={{ base: "sm", md: "md" }} mb={1} isTruncated pl={{ base: 2, lg: 0 }}>Welcome, Jason</Heading>
        <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} noOfLines={2} pl={{ base: 2, lg: 0 }}>
          Start a new chat, or pick up where you left off
        </Text>
      </Box>
      <Box flexShrink={0}>
        <Button
          leftIcon={<Icon as={LuPlus} boxSize={{ base: 4, md: 5 }} />}
          color="white"
          bg="#2348B7"
          onClick={() => {}}
          size={{ base: "sm", md: "md" }}
          whiteSpace="nowrap"
          minW="auto"
        >
          <Text display={{ base: "none", sm: "block" }}>New Chat</Text>
          <Text display={{ base: "block", sm: "none" }}>New</Text>
        </Button>
      </Box>
    </Flex>
  )

  const content = (
    <Stack spacing={8} pb={8}>
      {/* Assistant Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {assistants.map((assistant, index) => (
          <Card key={index} variant="outline" height="100%">
            <CardBody>
              <Stack spacing={4}>
                {!assistant.isCreateNew ? (
                  <>
                    <HStack spacing={3} align="center">
                      <Box
                        position="relative"
                        width="32px"
                        height="32px"
                      >
                        <Icon 
                          as={LuUser} 
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          boxSize={5}
                          color="black"
                        />
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          right={0}
                          bottom={0}
                          borderRadius="full"
                          border="1px solid"
                          borderColor="blackAlpha.900"
                />
              </Box>
                      <Text fontWeight="medium">{assistant.name}</Text>
                </HStack>
                    <Text fontSize="sm" color="gray.600" noOfLines={3}>
                      {assistant.description}
                    </Text>
                    <Box>
                      <Button 
                        size="sm" 
                        variant="link"
                        color="#2348B7"
                        rightIcon={<Icon as={LuArrowRight} />}
                        p={0}
                        height="auto"
                        _hover={{
                          textDecoration: 'none',
                          color: 'blue.600'
                        }}
                        onClick={() => handleStartChat(assistant.name)}
                      >
                        Start a chat
                      </Button>
                  </Box>
                  </>
                ) : (
                  <Flex 
                    direction="column" 
                    align="center" 
                    justify="center" 
                    height="100%"
                    minH="140px"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Icon as={LuPlus} />}
                    >
                      Create New Assistant
                    </Button>
                  </Flex>
                )}
              </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

      {/* Recent Chats Section */}
      <Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Recent Chats</Heading>
          <Select width="200px" size="sm" defaultValue="all">
            <option value="all">All</option>
            <option value="no-assistant">No assistant</option>
            <option value="sales-support">Sales Support Assistant</option>
          </Select>
        </Flex>
        
        {/* Table view for larger screens */}
        <Box display={{ base: 'none', lg: 'block' }}>
          <Card>
            <Table>
              <Thead>
                <Tr>
                  <Th>NAME</Th>
                  <Th>ASSISTANT</Th>
                  <Th>CREATED BY</Th>
                  <Th>LAST UPDATED</Th>
                </Tr>
              </Thead>
              <Tbody>
                {recentChats.map((chat, index) => (
                  <Tr key={index} cursor="pointer" _hover={{ bg: 'gray.50' }}>
                    <Td>{chat.title}</Td>
                    <Td>{chat.assistant}</Td>
                    <Td>{chat.createdBy}</Td>
                    <Td>{chat.lastUpdated}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        </Box>

        {/* Card view for screens between 321px and 992px */}
        <Box display={{ base: 'block', lg: 'none' }}>
          <Stack spacing={4}>
            {recentChats.map((chat, index) => (
              <Card key={index} variant="outline" cursor="pointer" _hover={{ bg: 'gray.50' }}>
                <CardBody>
                  <Stack spacing={3}>
                    <Text fontWeight="semibold" noOfLines={2}>
                      {chat.title}
                    </Text>
                    <Stack spacing={2}>
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color="gray.600">Assistant</Text>
                        <Text fontSize="sm">{chat.assistant}</Text>
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color="gray.600">Created by</Text>
                        <Text fontSize="sm">{chat.createdBy}</Text>
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color="gray.600">Last updated</Text>
                        <Text fontSize="sm">{chat.lastUpdated}</Text>
                      </Flex>
                    </Stack>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </Stack>
        </Box>
      </Box>
    </Stack>
  )

  return (
    <Page height="100vh">
      <PageBody
        contentWidth="container.2xl"
        bg="page-body-bg-subtle"
        py={{ base: 4, xl: 8 }}
        px={{ base: 4, xl: 8 }}
        height="calc(100vh - 0px)"
        overflow="auto"
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {header}
        {content}
      </PageBody>
    </Page>
  )
}
