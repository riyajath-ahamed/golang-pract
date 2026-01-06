import { Box, Card, Heading, Text } from "@chakra-ui/react";
import BarChartComponent from "../components/common/barChart";

const FrequentlyPurchasedProducts = () => {
  const data = {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    series: [
      {
        name: "Revenue",
        data: [320, 332, 301, 334, 390, 320, 332, 301, 334, 390,320, 332, 301, 334, 390,320, 332, 301, 334, 390],
        color: "#6366F1",
      },
      {
        name: "Expenses",
        data: [220, 182, 191, 234, 290, 220, 182, 191, 234, 290,220, 182, 191, 234, 290,220, 182, 191, 234, 290],
        color: "#F59E0B",
      },
    ],
  }
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

          <BarChartComponent data={data} />
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default FrequentlyPurchasedProducts;

