import { Box, Card, Heading, Text } from "@chakra-ui/react";

const FrequentlyPurchasedProducts = () => {
  return (
    <Box>
      <Box mb={8}>
        <Heading size="xl" fontWeight="bold" fontFamily="heading">
          Frequently Purchased Products
        </Heading>
        <Text color="gray.500" mt={1}>
        Top 20 Frequently Purchased Products
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
              Top 20 Frequently Purchased Products
          </Heading>
          
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default FrequentlyPurchasedProducts;

