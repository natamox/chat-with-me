import { Box, HStack } from '@chakra-ui/react';
import PageContainer from '@components/page-container';

function OneToOneChat() {
  return (
    <PageContainer>
      <HStack>
        <Box w="50%" h="65vh" background="telegram.100" borderWidth="1px" borderRadius="base">
          2
        </Box>
        <Box w="50%" h="65vh" background="chakra-border-color" borderWidth="1px" borderRadius="base">
          3
        </Box>
      </HStack>
    </PageContainer>
  );
}

export default OneToOneChat;
