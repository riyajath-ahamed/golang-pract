import { Box, Card, Heading, Text } from "@chakra-ui/react";
import CountryLevelRevenueTable from "../components/common/table";

const RevenueTable = () => {
  return (
    <Box>
      <Box mb={8}>
        <Heading size="xl" fontWeight="bold" fontFamily="heading">
          Country-Level Revenue Table​
        </Heading>
        <Text color="gray.500" mt={1}>
          View and manage all your country-level revenue data.
        </Text>
      </Box>

      <Card.Root
        bg={{ _light: "white", _dark: "gray.800" }}
        shadow="sm"
        rounded="xl"
        border="none"
      >
        <Card.Body p={6}>
          <Heading size="md" fontWeight="semibold" mb={4}>
            Analytics Overview
          </Heading>
          <CountryLevelRevenueTable />
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default RevenueTable;

