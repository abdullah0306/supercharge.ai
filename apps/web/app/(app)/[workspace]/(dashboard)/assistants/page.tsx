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
import { useRouter, useParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export default function AssistantsPage() {
  const router = useRouter()
  const params = useParams()
  const workspaceId = params?.workspace as string

  // Assistant cards data
  const assistants = [
    {
      name: 'Sales Support Assistant',
      description: 'Specialized in sales support, helping with customer inquiries, sales strategies, and deal management.',
      creator: 'Default Assistant',
      type: 'Default',
      category: 'Sales'
    },
    {
      name: 'HR Assistant',
      description: 'Provides guidance on HR policies, employee relations, and workplace procedures.',
      creator: 'Default Assistant',
      type: 'Default',
      category: 'Human Resources'
    },
    {
      name: 'Marketing Assistant',
      description: 'Helps create marketing content, analyze campaigns, and maintain brand consistency.',
      creator: 'Default Assistant',
      type: 'Default',
      category: 'Marketing'
    },
    {
      name: 'Data Analyst',
      description: 'Analyzes data, generates insights, and helps with data visualization and reporting.',
      creator: 'Default Assistant',
      type: 'Default',
      category: 'Analytics'
    },
    {
      name: 'Bug Reporting Assistant',
      description: 'Assists with documenting bugs, creating detailed reports, and tracking technical issues.',
      creator: 'Default Assistant',
      type: 'Default',
      category: 'Support'
    },
    {
      name: 'RFP Response Assistant',
      description: 'Helps analyze RFP requirements and create comprehensive proposal responses.',
      creator: 'Default Assistant',
      type: 'Default',
      category: 'Business'
    }
  ]

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
    <Stack spacing={6} mb={8} pl={{ base: "20px", md: "44px", lg: "0" }}>
      <Flex justify="space-between" align="center" width="100%">
        <Box maxW={{ base: "60%", sm: "100%" }} overflow="hidden">
          <Heading size={{ base: "sm", md: "md" }} mb={1} isTruncated pl={{ base: 2, lg: 0 }}>Assistants</Heading>
          <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} noOfLines={2} pl={{ base: 2, lg: 0 }}>
            Create and manage your AI-powered business assistants.
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
            <Text display={{ base: "none", sm: "block" }}>Create New Assistant</Text>
            <Text display={{ base: "block", sm: "none" }}>Create</Text>
          </Button>
        </Box>
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
                    onClick={() => handleStartChat(assistant.name)}
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