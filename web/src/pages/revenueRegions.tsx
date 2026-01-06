import { Box, Card, Heading, HStack, Skeleton, Text } from "@chakra-ui/react";
import { useTopRegions } from "../context";
import { useEffect, useMemo } from "react";
import BarChartComponent from "../components/common/barChart";

const RevenueRegions = () => {

  const { list, isLoading, fetch } = useTopRegions();

  useEffect(() => {
    fetch();
  }, []);

  const data = useMemo(() => ({
    categories: list.map((item) => item.region),
    series: [
      {
        name: "Revenue",
        data: list.map((item) => item.revenue),
      },
    ],
  }), [list]);

  const totalRevenue = useMemo(() => ({
    categories: list.map((item) => item.region),
    series: [
      {
        name: "Items Sold",
        data: list.map((item) => item.itemsSold),
      },
    ],
  }), [list]);
  
  return (
    <Box>
      <Box mb={8}>
        <Heading size="xl" fontWeight="bold" fontFamily="heading">
          Revenue Regions
        </Heading>
        <Text color="gray.500" mt={1}>
          Top 30 Regions by Revenue
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
            Top 30 Regions by Revenue
          </Heading>

          {isLoading ? (
            <Skeleton height={700} />
          ) : (
            <HStack>
              <BarChartComponent data={data} height={700} horizontal={true} />
            <BarChartComponent data={totalRevenue} height={700} horizontal={true} color="#4F4" />
            </HStack>
          )}
          
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default RevenueRegions;

