import { Box, Card, Heading, Skeleton, Text } from "@chakra-ui/react";
import BarChartComponent from "../components/common/barChart";
import { useTopProducts } from "../context";
import { useEffect, useMemo } from "react";

const FrequentlyPurchasedProducts = () => {

  const { list, isLoading, fetch } = useTopProducts();

  useEffect(() => {
    fetch();
  }, []);

  const data = useMemo(() => ({
    categories: list.map((item) => item.product),
    series: [
      {
        name: "Products",
        data: list.map((item) => item.count),
      },  
      {
        name: "Stock",
        data: list.map((item) => item.stock),
      },
    ],
  }), [list]);  
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

          {isLoading ? (
            <Skeleton height={400} />
          ) : (
            <BarChartComponent data={data} />
          )}
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default FrequentlyPurchasedProducts;

