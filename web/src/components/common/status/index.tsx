import { Box, HStack, Icon, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import {
  AlertCircle,
  CheckCircle,
  LineChart,
  ListEndIcon,
  ListStart,
  Loader2,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";

type ETLJobStatusType = {
  rowsProcessed: number;
  startTime: Date;
  endTime: Date;
  duration: number;
  status: "success" | "error" | "warning" | "info";
};

type StatusCardProps = {
  label: string;
  value: string | number;
  icon: ReactNode;
};

const STATUS_ICON_MAP = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Loader2,
} as const;

const StatusCard = ({ label, value, icon }: StatusCardProps) => (
  <VStack
    gap={1}
    bg="white"
    rounded="lg"
    p={{ base: 3, md: 4 }}
    boxShadow="md"
    minW={0}
  >
    <HStack gap={1} align="center" flexWrap="wrap" justify="center">
      <Text
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="medium"
        color="gray.500"
        textAlign="center"
      >
        {label}
      </Text>
      <Icon boxSize={{ base: 4, md: 5 }} color="brand.500">
        {icon}
      </Icon>
    </HStack>
    <Text
      fontSize={{ base: "lg", md: "2xl" }}
      fontWeight="bold"
      fontFamily="heading"
      color="brand.500"
      textAlign="center"
      wordBreak="break-word"
    >
      {typeof value === "number" ? value.toLocaleString() : value}
    </Text>
  </VStack>
);

const ETLJobStatus = ({
  rowsProcessed,
  startTime,
  endTime,
  status,
}: ETLJobStatusType) => {
  const StatusIcon = STATUS_ICON_MAP[status];

  return (
    <Box
      w="100%"
      bg="gray.50"
      rounded="lg"
      border="2px dashed"
      borderColor="gray.200"
      p={{ base: 3, md: 4 }}
    >
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={{ base: 3, md: 4 }}>
        <StatusCard
          label="Rows Processed"
          value={rowsProcessed}
          icon={<LineChart />}
        />
        <StatusCard
          label="Start Time"
          value={startTime.toLocaleString()}
          icon={<ListStart />}
        />
        <StatusCard
          label="End Time"
          value={endTime.toLocaleString()}
          icon={<ListEndIcon />}
        />
        <StatusCard
          label="Status"
          value={status === "success" ? "Complete" : "Running"}
          icon={<StatusIcon />}
        />
      </SimpleGrid>
    </Box>
  );
};

export default ETLJobStatus;