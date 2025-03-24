'use client'

import {
  Card,
  CardBody,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Icon,
  Flex,
  Stack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import {
  Page,
  PageBody,
} from '@saas-ui-pro/react'
import { LuPlus, LuArrowRight, LuUser, LuSearch } from 'react-icons/lu'

export default function AssistantsPage() {
  // Assistant cards data
  const assistants = [
    {
      name: 'Sales Support Assistant',
      description: 'The Sales Support Assistant is designed to assist the sales team at SprinterSoftwareGroup by drafting...',
      creator: 'Jake Rosenthal',
      type: 'Shared',
      category: 'Sales'
    },
    {
      name: 'Internal HR Assistant',
      description: 'This assistant provides information and clarifications on company policies for new and existing...',
      creator: 'Jason Fleming',
      type: 'Shared'
    },
    {
      name: 'RFP Response Assistant',
      description: 'This assistant is designed to help SprinterSoftwareGroup efficiently respond to Requests for Proposal...',
      creator: 'Jason Fleming',
      type: 'Shared'
    },
    {
      name: 'Sales Onboarding & Training Assistant',
      description: 'This assistant is designed to facilitate the onboarding and training process for new sales employees at...',
      creator: 'Jason Fleming',
      type: 'Shared',
      category: 'Sales'
    },
    {
      name: 'SprinterSoftwareGroup General Assistant',
      description: 'A general purpose assistant with context of SprinterSoftwareGroup.',
      creator: 'Jake Rosenthal',
      type: 'Shared'
    },
    {
      name: 'HR Recruitment Assistant',
      description: 'An AI assistant designed to aid human resources employees at SprinterSoftwareGroup in managing...',
      creator: 'Jason Fleming',
      type: 'Shared',
      category: 'Human Resources'
    },
    {
      name: 'Marketing Assistant',
      description: 'This assistant aids in creating tailored marketing messages, ensures a consistent brand voice, and...',
      creator: 'Jason Fleming',
      type: 'Shared',
      category: 'Marketing'
    },
    {
      name: 'Data Analyst',
      description: 'Analyze files with diverse data and formatting and generate files such as graphs.',
      creator: 'Default Assistant',
      type: 'Default'
    },
    {
      name: 'Bug Reporting Assistant',
      description: 'This assistant aids the customer support team at SprinterSoftwareGroup by enhancing their ability...',
      creator: 'Jake Rosenthal',
      type: 'Shared'
    }
  ]

  const header = (
    <Stack spacing={6} mb={8}>
      <Flex justify="space-between" align="center" width="100%">
        <Box>
          <Heading size="md">Assistants</Heading>
          <Text color="gray.600">Create and manage your AI-powered business assistants.</Text>
        </Box>
        <Button
          leftIcon={<Icon as={LuPlus} />}
          color="white"
          bg="#2348B7"
          onClick={() => {}}
        >
          Create New Assistant
        </Button>
      </Flex>
      <Flex>
        <InputGroup maxW="300px">
          <InputLeftElement>
            <Icon as={LuSearch} color="gray.400" />
          </InputLeftElement>
          <Input placeholder="Search Assistants" />
        </InputGroup>
      </Flex>
    </Stack>
  )

  const content = (
    <Stack spacing={6} pb={8}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {assistants.map((assistant, index) => (
          <Card key={index} variant="outline">
            <CardBody>
              <Stack spacing={4}>
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
                <HStack spacing={2} fontSize="sm" color="gray.500">
                  <Text>{assistant.creator}</Text>
                  <Text>•</Text>
                  <Text>{assistant.type}</Text>
                  {assistant.category && (
                    <>
                      <Text>•</Text>
                      <Text>{assistant.category}</Text>
                    </>
                  )}
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
              </Stack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
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