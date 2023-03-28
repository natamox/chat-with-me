// import LocalCamera from '@components/local-camera';
import PageContainer from '@components/page-container';
import { login } from '@services';
import { WSocket } from '@utils';
import { useEffect, useMemo } from 'react';

function OneToOneChat() {
  // 加入房间
  const socket = useMemo(() => new WSocket('2'), []);
  function joinRoom() {
    login();
    // socket.emit('join');
  }
  // useEffect(() => {
  //   console.log('first');
  //   return () => {
  //     socket.destroy();
  //   };
  // }, [socket]);

  return (
    <PageContainer>
      <button type="button" onClick={joinRoom}>
        加入
      </button>
      {/* <HStack>
        <Center minH="400px" w="50%" p={4} background="telegram.100" borderWidth="1px" borderRadius="base">
          <LocalCamera />
        </Center>
        <Center minH="400px" w="50%" p={4} background="chakra-border-color" borderWidth="1px" borderRadius="base">
          <LocalCamera />
        </Center>
      </HStack> */}
    </PageContainer>
  );
}

export default OneToOneChat;
