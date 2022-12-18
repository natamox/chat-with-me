import { Card, CardBody, Text } from '@chakra-ui/react';
import PageContainer from '@components/page-container';

function DashBoard() {
  return (
    <PageContainer>
      <Card>
        <CardBody>
          <Text>View a summary of all your customers over the last month.</Text>
        </CardBody>
      </Card>
    </PageContainer>
  );
}

export default DashBoard;
