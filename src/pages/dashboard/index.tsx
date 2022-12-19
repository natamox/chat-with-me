import { Card, CardBody, HStack, Text } from '@chakra-ui/react';
import Loading from '@components/loading';
import PageContainer from '@components/page-container';

function DashBoard() {
  return (
    <PageContainer>
      <HStack>
        <Loading />
        <Card>
          <CardBody>
            <Text>View a summary of all your customers over the last month.</Text>
          </CardBody>
        </Card>
      </HStack>
    </PageContainer>
  );
}

export default DashBoard;
