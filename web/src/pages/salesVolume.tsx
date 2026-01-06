import { Box, Card, Heading, Skeleton, Text } from "@chakra-ui/react";
import AreaChartComponent from "../components/common/areaChart";
import { useEffect, useMemo } from "react";
import { useMonthlySalesData } from "../context";

const SalesVolume = () => {
  
  const { list, isLoading, fetch } = useMonthlySalesData();

  useEffect(() => {
    fetch();
  }, []);

  const data = useMemo(() => ({
    categories: list.map((item) => item.month),
    series: [
      {
        name: "Sales",
        data: list.map((item) => item.sales),
      },
    ],
  }), [list]);

  return (
    <Box>
      <Box mb={8}>
        <Heading size="xl" fontWeight="bold" fontFamily="heading">
          Sales Volume
        </Heading>
        <Text color="gray.500" mt={1}>
            View the months with the highest sales volume.
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
            Months with the highest sales volume
          </Heading>
          {isLoading ? (
            <Skeleton height={400} />
          ) : (
            <AreaChartComponent data={data} height={400} />
          )}
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default SalesVolume;

