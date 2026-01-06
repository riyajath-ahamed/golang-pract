import { Box, Card, Heading, Text } from "@chakra-ui/react";
import AreaChartComponent from "../components/common/areaChart";

const SalesVolume = () => {
  const data = {

    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    series: [
      {
        name: "Sales",
        data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
      },
    ],
  }
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
          <AreaChartComponent data={data} height={400} />
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default SalesVolume;

