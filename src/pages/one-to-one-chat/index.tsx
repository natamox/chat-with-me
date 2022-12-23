import { Center, HStack } from '@chakra-ui/react';
import LocalCamera from '@components/local-camera';
import PageContainer from '@components/page-container';

function OneToOneChat() {
  return (
    <PageContainer>
      <HStack>
        <Center minH="400px" w="50%" p={4} background="telegram.100" borderWidth="1px" borderRadius="base">
          <LocalCamera />
        </Center>
        <Center minH="400px" w="50%" p={4} background="chakra-border-color" borderWidth="1px" borderRadius="base">
          <LocalCamera />
        </Center>
      </HStack>
    </PageContainer>
  );
}

export default OneToOneChat;
