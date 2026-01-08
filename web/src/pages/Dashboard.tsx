import { Box, Card, Flex, Grid, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { Activity, ArrowDownUp, Globe2, GlobeLockIcon, Package, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import StatCard from "../components/common/statCard";
import ETLJobStatus from "../components/common/status";
import { useDashboardStats } from "../context";
import { useETLStatus } from "../context/AnalyticsContext";

const Dashboard = () => {
  const { stats, isLoading, refresh } = useDashboardStats();
  const { data, isLoading: isETLStatusLoading, fetch: fetchETLStatus } = useETLStatus();

  useEffect(() => {
    refresh();
    fetchETLStatus();
  }, []);

  const statCards = [
    {
      title: "Countries",
      value: isLoading ? "..." : stats.totalCountries.toLocaleString(),
      icon: Globe2,
      iconColor: "green.600",
      iconBg: "green.100",
    },
    {
      title: "Regions",
      value: isLoading ? "..." : stats.totalRegions.toLocaleString(),
      icon: GlobeLockIcon,
      iconColor: "blue.600",
      iconBg: "blue.100",
    },
    {
      title: "Products",
      value: isLoading ? "..." : stats.totalProducts.toLocaleString(),
      icon: Package,
      iconColor: "purple.600",
      iconBg: "purple.100",
    },
    {
      title: "Transactions",
      value: isLoading ? "..." : stats.totalTransactions.toLocaleString(),
      icon: ArrowDownUp,
      iconColor: "orange.600",
      iconBg: "orange.100",
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box mb={8}>
        <Heading size="xl" fontWeight="bold" fontFamily="heading">
          Dashboard
        </Heading>
        <Text color="gray.500" mt={1}>
          Welcome back! Here's what's happening with your data.
        </Text>
      </Box>

      {/* Stats Grid */}
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={6}
        mb={8}
      >
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </Grid>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        <Card.Root
          bg={{ _light: "white", _dark: "gray.800" }}
          shadow="sm"
          rounded="xl"
          border="none"
        >
          <Card.Body p={6}>
            <Flex justify="space-between" align="center" mb={6}>
              <Box>
                <Heading size="md" fontWeight="semibold">
                  ETL Job Performance
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  View the performance of the ETL jobs.
                </Text>
              </Box>
              <Icon boxSize={5} color="brand.500">
                <TrendingUp />
              </Icon>
            </Flex>
            {isETLStatusLoading || !data ? (
              <Box p={4} textAlign="center" color="gray.500">
                Loading ETL status...
              </Box>
            ) : (
              <ETLJobStatus
                rowsProcessed={data.rows_processed}
                startTime={new Date(data.start_time)}
                endTime={new Date(data.end_time)}
                duration={parseInt(data.duration)}
                status={data.is_running ? "info" : "success"}
              />
            )}
          </Card.Body>
        </Card.Root>

        <Card.Root
          bg={{ _light: "white", _dark: "gray.800" }}
          shadow="sm"
          rounded="xl"
          border="none"
        >
          <Card.Body p={6}>
            <Heading size="md" fontWeight="semibold" mb={6}>
              Backend Status
            </Heading>
            <VStack gap={4} align="stretch">
              {[1, 2,].map((i) => (
                <Flex
                  key={i}
                  p={3}
                  bg="gray.50"
                  rounded="lg"
                  align="center"
                  gap={3}
                >
                  <Flex
                    w={8}
                    h={8}
                    align="center"
                    justify="center"
                    bg="brand.100"
                    rounded="lg"
                  >
                    <Icon boxSize={4} color="brand.600">
                      <Activity />
                    </Icon>
                  </Flex>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium">
                      ETL Job #{i} completed
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {i % 2 === 0 ? "Running" : "Completed"}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </VStack>
          </Card.Body>
        </Card.Root>
      </Grid>
    </Box>
  );
};

export default Dashboard;

