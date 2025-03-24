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

interface DashboardPageProps {
  params: {
    workspace: string
  }
}

export const DashboardPage: React.FC<DashboardPageProps> = ({}) => {
  // Assistant cards data
  const assistants = [
    {
      name: 'Sales Support Assistant',
      description: 'The Sales Support Assistant is designed to assist the sales team at SprinterSoftwareGroup by drafting...',
      initials: 'SA'
    },
    {
      name: 'Internal HR Assistant',
      description: 'This assistant provides information and clarifications on company policies for new and existing...',
      initials: 'IA'
    },
    {
      name: 'RFP Response Assistant',
      description: 'This assistant is designed to help SprinterSoftwareGroup efficiently respond to Requests for Proposal...',
      initials: 'RA'
    },
    {
      name: 'Sales Onboarding & Training Assistant',
      description: 'This assistant is designed to facilitate the onboarding and training process for new sales employees at...',
      initials: 'SA'
    },
    {
      name: 'SprinterSoftwareGroup General Assistant',
      description: 'A general purpose assistant with context of SprinterSoftwareGroup.',
      initials: 'GA'
    },
    {
      name: 'HR Recruitment Assistant',
      description: 'An AI assistant designed to aid human resources employees at SprinterSoftwareGroup in managing...',
      initials: 'HA'
    },
    {
      name: 'LinkedIn Outreach Assistant',
      description: 'This assistant helps SprinterSoftwareGroup with crafting custom, concise sales emails tailored...',
      initials: 'LA'
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

  const header = (
    <Flex justify="space-between" align="center" width="100%" mb={8}>
          <Box>
        <Heading size="md">Welcome, Jason</Heading>
        <Text color="gray.600">Start a new chat, or pick up where you left off</Text>
          </Box>
          <Button
        leftIcon={<Icon as={LuPlus} />}
        color="white"
        bg="#2348B7"
        onClick={() => {}}
      >
        New Chat
          </Button>
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
